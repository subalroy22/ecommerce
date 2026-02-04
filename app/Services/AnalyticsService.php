<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Get total revenue for a time period
     */
    public function getTotalRevenue(Carbon $start = null, Carbon $end = null): float
    {
        $query = Order::where('payment_status', 'completed');

        if ($start) {
            $query->where('created_at', '>=', $start);
        }

        if ($end) {
            $query->where('created_at', '<=', $end);
        }

        return (float) $query->sum('total');
    }

    /**
     * Get order statistics
     */
    public function getOrderStats(Carbon $start = null, Carbon $end = null): array
    {
        $query = Order::query();

        if ($start) {
            $query->where('created_at', '>=', $start);
        }

        if ($end) {
            $query->where('created_at', '<=', $end);
        }

        return [
            'total_orders' => $query->count(),
            'pending_orders' => (clone $query)->where('status', 'pending')->count(),
            'processing_orders' => (clone $query)->where('status', 'processing')->count(),
            'shipped_orders' => (clone $query)->where('status', 'shipped')->count(),
            'delivered_orders' => (clone $query)->where('status', 'delivered')->count(),
            'cancelled_orders' => (clone $query)->where('status', 'cancelled')->count(),
            'refunded_orders' => (clone $query)->where('status', 'refunded')->count(),
        ];
    }

    /**
     * Get customer statistics
     */
    public function getCustomerStats(Carbon $start = null, Carbon $end = null): array
    {
        $query = User::where('role', 'customer');

        $newCustomersQuery = (clone $query);
        if ($start) {
            $newCustomersQuery->where('created_at', '>=', $start);
        }
        if ($end) {
            $newCustomersQuery->where('created_at', '<=', $end);
        }

        return [
            'total_customers' => $query->count(),
            'new_customers' => $newCustomersQuery->count(),
            'active_customers' => $query->where('is_active', true)->count(),
            'inactive_customers' => $query->where('is_active', false)->count(),
        ];
    }

    /**
     * Get top selling products
     */
    public function getTopProducts(int $limit = 10, Carbon $start = null, Carbon $end = null): array
    {
        $query = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select(
                'products.id',
                'products.name',
                'products.slug',
                'products.price',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.total) as total_revenue')
            )
            ->groupBy('products.id', 'products.name', 'products.slug', 'products.price');

        if ($start) {
            $query->where('order_items.created_at', '>=', $start);
        }

        if ($end) {
            $query->where('order_items.created_at', '<=', $end);
        }

        return $query->orderByDesc('total_revenue')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get low stock products
     */
    public function getLowStockProducts(int $threshold = 10): array
    {
        return Product::where('inventory_quantity', '<=', $threshold)
            ->where('is_active', true)
            ->select('id', 'name', 'slug', 'sku', 'inventory_quantity', 'price')
            ->orderBy('inventory_quantity', 'asc')
            ->get()
            ->toArray();
    }

    /**
     * Get product statistics
     */
    public function getProductStats(): array
    {
        return [
            'total_products' => Product::count(),
            'active_products' => Product::where('is_active', true)->count(),
            'inactive_products' => Product::where('is_active', false)->count(),
            'low_stock_products' => Product::where('inventory_quantity', '<=', 10)
                ->where('inventory_quantity', '>', 0)
                ->count(),
            'out_of_stock_products' => Product::where('inventory_quantity', 0)->count(),
            'total_inventory_value' => (float) Product::sum(DB::raw('price * inventory_quantity')),
        ];
    }

    /**
     * Get category statistics
     */
    public function getCategoryStats(): array
    {
        return [
            'total_categories' => DB::table('categories')->count(),
            'active_categories' => DB::table('categories')->where('is_active', true)->count(),
        ];
    }

    /**
     * Get brand statistics
     */
    public function getBrandStats(): array
    {
        return [
            'total_brands' => DB::table('brands')->count(),
            'active_brands' => DB::table('brands')->where('is_active', true)->count(),
        ];
    }

    /**
     * Get sales by hour (orders placed by time of day)
     */
    public function getSalesByHour(): array
    {
        $orders = Order::selectRaw('HOUR(created_at) as hour, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(1))
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        $hourlyData = [];
        for ($i = 0; $i < 24; $i++) {
            $hourlyData[$i] = 0;
        }

        foreach ($orders as $order) {
            $hourlyData[$order->hour] = $order->count;
        }

        return $hourlyData;
    }

    /**
     * Get customer conversion metrics
     */
    public function getConversionMetrics(): array
    {
        $totalUsers = User::where('role', 'customer')->count();
        $usersWithCart = \DB::table('cart_items')->distinct('user_id')->count('user_id');
        $usersWithWishlist = \DB::table('wishlist_items')->distinct('user_id')->count('user_id');
        $usersWithOrders = Order::distinct('user_id')->count('user_id');
        $completedPayments = Order::where('payment_status', 'completed')->distinct('user_id')->count('user_id');

        // Product views = users with cart + users with wishlist + users with orders (real data)
        $productViews = $usersWithCart + $usersWithWishlist + $usersWithOrders;
        if ($productViews === 0) {
            $productViews = max($totalUsers, 1);
        }

        return [
            'total_users' => $totalUsers,
            'product_views' => $productViews,
            'add_to_cart' => $usersWithCart,
            'checkout' => $usersWithOrders,
            'payment_done' => $completedPayments,
        ];
    }

    /**
     * Get recent orders with items
     */
    public function getRecentOrders(int $limit = 5): array
    {
        return Order::with(['items', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'user_name' => $order->user->name,
                    'total' => $order->total,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'created_at' => $order->created_at,
                    'items_count' => $order->items->count(),
                ];
            })
            ->toArray();
    }

    /**
     * Get comprehensive dashboard data
     */
    public function getDashboardData(): array
    {
        return [
            'revenue' => $this->getTotalRevenue(),
            'order_stats' => $this->getOrderStats(),
            'customer_stats' => $this->getCustomerStats(),
            'product_stats' => $this->getProductStats(),
            'category_stats' => $this->getCategoryStats(),
            'brand_stats' => $this->getBrandStats(),
            'top_products' => $this->getTopProducts(5),
            'low_stock_products' => $this->getLowStockProducts(),
            'sales_by_hour' => $this->getSalesByHour(),
            'conversion_metrics' => $this->getConversionMetrics(),
            'recent_orders' => $this->getRecentOrders(),
        ];
    }
}
