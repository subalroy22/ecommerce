<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\CartItem;
use App\Services\OrderService;
use App\Repositories\OrderRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $orderService;
    protected $orderRepository;

    public function __construct(OrderService $orderService, OrderRepository $orderRepository)
    {
        $this->orderService = $orderService;
        $this->orderRepository = $orderRepository;
    }

    /**
     * Show checkout page
     */
    public function checkout()
    {
        $user = auth()->user();
        $cartItems = CartItem::where('user_id', $user->id)->with('product')->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        $subtotal = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'user' => $user,
        ]);
    }

    /**
     * Store a newly created order
     */
    public function store(StoreOrderRequest $request)
    {
        try {
            $order = $this->orderService->createOrder(auth()->user(), $request->validated());

            // Process payment
            $this->orderService->processPayment($order, [
                'payment_method' => $request->payment_method,
                'transaction_id' => null,
            ]);

            return redirect()->route('order.show', $order->order_number)->with('success', 'Order created successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display order history (customer)
     */
    public function index()
    {
        $orders = $this->orderRepository->getUserOrders(auth()->user());

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display order details (customer)
     */
    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $order = $this->orderRepository->getById($order->id);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Display admin orders list
     */
    public function adminIndex(Request $request)
    {
        $filters = $request->only([
            'search',
            'status',
            'payment_status',
            'sort_by',
            'sort_order',
            'per_page'
        ]);

        $orders = $this->orderRepository->getAllOrders(15, $filters);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $filters,
        ]);
    }

    /**
     * Display admin order details
     */
    public function adminShow(Order $order)
    {
        $order = $this->orderRepository->getById($order->id);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Update order status (admin only)
     */
    public function updateStatus(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled,refunded',
        ]);

        $this->orderService->updateOrderStatus($order, $validated['status']);

        return back()->with('success', 'Order status updated successfully');
    }

    /**
     * Update payment status (admin only)
     */
    public function updatePaymentStatus(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $validated = $request->validate([
            'payment_status' => 'required|in:pending,completed,failed,refunded',
        ]);

        $this->orderService->updatePaymentStatus($order, $validated['payment_status']);

        return back()->with('success', 'Payment status updated successfully');
    }

    /**
     * Refund order (admin only)
     */
    public function refund(Order $order)
    {
        $this->authorize('update', $order);

        $this->orderService->refundOrder($order);

        return back()->with('success', 'Order refunded successfully');
    }
}

