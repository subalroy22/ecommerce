<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\User;
use App\Models\CartItem;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Create an order from cart items
     */
    public function createOrder(User $user, array $data): Order
    {
        return DB::transaction(function () use ($user, $data) {
            // Get cart items
            $cartItems = CartItem::where('user_id', $user->id)->with('product')->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            // Calculate totals
            $subtotal = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);
            $tax = $data['tax'] ?? 0;
            $shipping = $data['shipping'] ?? 0;
            $discount = $data['discount'] ?? 0;
            $total = $subtotal + $tax + $shipping - $discount;

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . date('Ymd') . '-' . str_pad(Order::count() + 1, 6, '0', STR_PAD_LEFT),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping' => $shipping,
                'discount' => $discount,
                'total' => $total,
                'payment_method' => $data['payment_method'] ?? 'cod',
                'payment_status' => 'pending',
                'shipping_address' => json_encode($data['shipping_address'] ?? []),
                'billing_address' => json_encode($data['billing_address'] ?? []),
                'notes' => $data['notes'] ?? null,
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                    'total' => $cartItem->product->price * $cartItem->quantity,
                ]);

                // Decrease product inventory
                $cartItem->product->decrement('inventory_quantity', $cartItem->quantity);
            }

            // Clear cart
            CartItem::where('user_id', $user->id)->delete();

            return $order;
        });
    }

    /**
     * Update order status
     */
    public function updateOrderStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);

        if ($status === 'shipped') {
            $order->update(['shipped_at' => now()]);
        } elseif ($status === 'delivered') {
            $order->update(['delivered_at' => now()]);
        }

        return $order;
    }

    /**
     * Process payment for order
     */
    public function processPayment(Order $order, array $paymentData): Payment
    {
        return DB::transaction(function () use ($order, $paymentData) {
            $paymentMethod = $paymentData['payment_method'] ?? 'cod';
            
            // Set payment status based on payment method
            $paymentStatus = $paymentMethod === 'cod' ? 'pending' : 'completed';
            
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => $paymentMethod,
                'transaction_id' => $paymentData['transaction_id'] ?? null,
                'amount' => $order->total,
                'status' => $paymentStatus,
                'response_data' => $paymentData['response_data'] ?? null,
            ]);

            // Update order payment status
            $order->update(['payment_status' => $paymentStatus]);

            return $payment;
        });
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(Order $order, string $status): Order
    {
        $order->update(['payment_status' => $status]);

        // Update the latest payment record if exists
        if ($order->payment) {
            $order->payment->update(['status' => $status]);
        }

        return $order;
    }

    /**
     * Refund order
     */
    public function refundOrder(Order $order): Order
    {
        return DB::transaction(function () use ($order) {
            // Restore inventory
            foreach ($order->items as $item) {
                $item->product->increment('inventory_quantity', $item->quantity);
            }

            // Update order status
            $order->update([
                'status' => 'refunded',
                'payment_status' => 'refunded',
            ]);

            // Create refund payment record
            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $order->payment_method,
                'amount' => -$order->total,
                'status' => 'refunded',
            ]);

            return $order;
        });
    }

    /**
     * Get user's orders with items
     */
    public function getUserOrders(User $user)
    {
        return $user->orders()
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }

    /**
     * Get order details
     */
    public function getOrderDetails(Order $order)
    {
        return $order->load('items.product', 'payment');
    }
}
