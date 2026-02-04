<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\User;

class OrderRepository
{
    /**
     * Get all orders with pagination and filters
     */
    public function getAllOrders($perPage = 15, array $filters = [])
    {
        $query = Order::with('user', 'items.product.images', 'payment')
            ->orderBy('created_at', 'desc');

        // Apply filters
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('id', $search)
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        // Apply sorting - default to created_at desc if no sort specified
        if (!empty($filters['sort_by'])) {
            $sortOrder = $filters['sort_order'] ?? 'asc';
            $query->orderBy($filters['sort_by'], $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate($perPage);
    }

    /**
     * Get user's orders
     */
    public function getUserOrders(User $user, $perPage = 10)
    {
        return $user->orders()
            ->with('items.product.images', 'payment')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get order by ID
     */
    public function getById($id)
    {
        return Order::with('user', 'items.product.images', 'payment')->findOrFail($id);
    }

    /**
     * Get order by order number
     */
    public function getByOrderNumber($orderNumber)
    {
        return Order::with('user', 'items.product.images', 'payment')
            ->where('order_number', $orderNumber)
            ->firstOrFail();
    }

    /**
     * Get orders by status
     */
    public function getByStatus($status, $perPage = 15)
    {
        return Order::with('user', 'items.product.images')
            ->where('status', $status)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get recent orders
     */
    public function getRecentOrders($limit = 10)
    {
        return Order::with('user', 'items.product.images')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get orders by date range
     */
    public function getByDateRange($startDate, $endDate, $perPage = 15)
    {
        return Order::with('user', 'items.product.images')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get order statistics
     */
    public function getStatistics()
    {
        return [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'processing_orders' => Order::where('status', 'processing')->count(),
            'shipped_orders' => Order::where('status', 'shipped')->count(),
            'delivered_orders' => Order::where('status', 'delivered')->count(),
            'total_revenue' => Order::where('payment_status', 'completed')->sum('total'),
        ];
    }
}

