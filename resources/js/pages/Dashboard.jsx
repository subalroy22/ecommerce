import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user && (user.role === 'admin' || user.role === 'manager');
    const topProductsChartRef = useRef(null);
    const salesByTimeChartRef = useRef(null);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(value);
    };

    // Draw pie chart for top products
    useEffect(() => {
        if (!isAdmin || !stats?.top_products || stats.top_products.length === 0 || !topProductsChartRef.current) return;

        const timer = setTimeout(() => {
            const canvas = topProductsChartRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            const width = rect.width;
            const height = rect.height;
            const centerX = width / 2;
            const centerY = height / 2 - 40;
            const radius = Math.min(width, height) / 2 - 70;

            const products = stats.top_products.slice(0, 5);
            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

            const total = products.reduce((sum, p) => {
                const revenue = parseFloat(p.total_revenue) || 0;
                return sum + revenue;
            }, 0);

            if (total === 0) return;

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);

            let currentAngle = -Math.PI / 2;
            products.forEach((product, index) => {
                const revenue = parseFloat(product.total_revenue) || 0;
                const sliceAngle = (revenue / total) * 2 * Math.PI;

                ctx.fillStyle = colors[index];
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.stroke();

                const labelAngle = currentAngle + sliceAngle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius * 0.65);
                const labelY = centerY + Math.sin(labelAngle) * (radius * 0.65);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const percentage = ((revenue / total) * 100).toFixed(0);
                ctx.fillText(`${percentage}%`, labelX, labelY);

                currentAngle += sliceAngle;
            });

            const legendY = height - 90;
            products.forEach((product, index) => {
                const legendX = 10 + (width / 2.5) * (index % 2);
                const legendRowY = legendY + (index >= 2 ? 25 : 0) + (index >= 4 ? 25 : 0);

                ctx.fillStyle = colors[index];
                ctx.fillRect(legendX, legendRowY, 12, 12);

                ctx.fillStyle = '#374151';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'left';
                const productName = product.name.substring(0, 12);
                ctx.fillText(`${productName}`, legendX + 18, legendRowY + 10);
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [stats, isAdmin]);

    // Draw bar chart for sales by time
    useEffect(() => {
        if (!isAdmin || !stats?.sales_by_hour || !salesByTimeChartRef.current) return;

        const timer = setTimeout(() => {
            const canvas = salesByTimeChartRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            const width = rect.width;
            const height = rect.height;
            const padding = { top: 30, right: 20, bottom: 30, left: 50 };

            const hourlyData = stats.sales_by_hour;
            const hours = Object.keys(hourlyData).map(h => parseInt(h));
            const values = Object.values(hourlyData);
            const maxValue = Math.max(...values, 1);

            const chartWidth = width - padding.left - padding.right;
            const chartHeight = height - padding.top - padding.bottom;
            const barWidth = chartWidth / (hours.length * 1.3);
            const barSpacing = chartWidth / hours.length;

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = '#E5E7EB';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 5; i++) {
                const y = padding.top + (chartHeight / 5) * i;
                ctx.beginPath();
                ctx.moveTo(padding.left, y);
                ctx.lineTo(width - padding.right, y);
                ctx.stroke();
            }

            ctx.fillStyle = '#6B7280';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            for (let i = 0; i <= 5; i++) {
                const y = padding.top + (chartHeight / 5) * i;
                const value = Math.round((maxValue / 5) * (5 - i));
                ctx.fillText(value.toString(), padding.left - 10, y);
            }

            hours.forEach((hour, index) => {
                const x = padding.left + (barSpacing * index) + (barSpacing - barWidth) / 2;
                const barHeight = (values[index] / maxValue) * chartHeight;
                const y = padding.top + chartHeight - barHeight;

                ctx.fillStyle = '#3B82F6';
                ctx.fillRect(x, y, barWidth, barHeight);

                if (values[index] > 0) {
                    ctx.fillStyle = '#111827';
                    ctx.font = 'bold 10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(values[index].toString(), x + barWidth / 2, y - 3);
                }
            });

            ctx.fillStyle = '#6B7280';
            ctx.font = '8px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            hours.forEach((hour, index) => {
                const x = padding.left + (barSpacing * index) + barSpacing / 2;
                const y = padding.top + chartHeight + 15;

                let displayHour = hour;
                let period = 'AM';
                if (hour === 0) {
                    displayHour = 12;
                } else if (hour >= 12) {
                    period = 'PM';
                    if (hour > 12) {
                        displayHour = hour - 12;
                    }
                }

                const timeStr = `${displayHour}:00 ${period}`;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(Math.PI / 2);
                ctx.fillText(timeStr, 0, 0);
                ctx.restore();
            });

            ctx.strokeStyle = '#374151';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(padding.left, padding.top);
            ctx.lineTo(padding.left, padding.top + chartHeight);
            ctx.lineTo(width - padding.right, padding.top + chartHeight);
            ctx.stroke();

            ctx.save();
            ctx.translate(15, padding.top + chartHeight / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillStyle = '#6B7280';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Orders', 0, 0);
            ctx.restore();
        }, 100);

        return () => clearTimeout(timer);
    }, [stats, isAdmin]);

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            refunded: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const dashboardContent = (
        <>
            <Head title="Dashboard" />
            <div className="py-8 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
                    </div>

                    {isAdmin && stats ? (
                        <div className="space-y-6">
                            {/* Top Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Total Orders */}
                                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 p-3 rounded-lg">
                                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z" />
                                                <path d="M16 16a2 2 0 11-4 0 2 2 0 014 0z" />
                                                <path d="M6 16a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.order_stats?.total_orders || 0}</p>
                                            <Link href={route('admin.orders.index')} className="text-blue-600 text-xs font-medium mt-2 inline-block hover:text-blue-700">
                                                View Details →
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Earnings */}
                                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-100 p-3 rounded-lg">
                                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.revenue || 0)}</p>
                                            <Link href={route('admin.orders.index')} className="text-green-600 text-xs font-medium mt-2 inline-block hover:text-green-700">
                                                View Details →
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Successful Delivery */}
                                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-purple-100 p-3 rounded-lg">
                                            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm font-medium">Delivered</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.order_stats?.delivered_orders || 0}</p>
                                            <Link href={route('admin.orders.index')} className="text-purple-600 text-xs font-medium mt-2 inline-block hover:text-purple-700">
                                                View Details →
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Profit */}
                                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-orange-100 p-3 rounded-lg">
                                            <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm font-medium">Total Profit</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.revenue * 0.3 || 0)}</p>
                                            <Link href={route('admin.orders.index')} className="text-orange-600 text-xs font-medium mt-2 inline-block hover:text-orange-700">
                                                View Details →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Top Products Pie Chart */}
                                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                                    {stats.top_products && stats.top_products.length > 0 ? (
                                        <div style={{ width: '100%', height: '320px', position: 'relative' }}>
                                            <canvas
                                                ref={topProductsChartRef}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'block'
                                                }}
                                            ></canvas>
                                        </div>
                                    ) : (
                                        <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded">
                                            <p className="text-gray-500">No product data available</p>
                                        </div>
                                    )}
                                </div>

                                {/* Sales by Time Chart */}
                                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Time</h3>
                                    {stats.sales_by_hour ? (
                                        <div style={{ width: '100%', height: '320px', position: 'relative' }}>
                                            <canvas
                                                ref={salesByTimeChartRef}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'block'
                                                }}
                                            ></canvas>
                                        </div>
                                    ) : (
                                        <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded">
                                            <p className="text-gray-500">No sales data available</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Recent Orders */}
                                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                                    <div className="space-y-0 divide-y divide-gray-200">
                                        {stats.recent_orders?.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                        {order.order_number.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{order.order_number}</p>
                                                        <p className="text-sm text-gray-500">{order.user_name}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                                                    <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Customer Conversion */}
                                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Conversion</h3>
                                    <div className="space-y-4">
                                        {stats.conversion_metrics && (
                                            <>
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium text-gray-700">Product Views</span>
                                                        <span className="text-sm font-semibold text-gray-900">{stats.conversion_metrics.product_views}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium text-gray-700">Add to Cart</span>
                                                        <span className="text-sm font-semibold text-gray-900">{stats.conversion_metrics.add_to_cart}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.conversion_metrics.add_to_cart / stats.conversion_metrics.product_views) * 100}%` }}></div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium text-gray-700">Checkout</span>
                                                        <span className="text-sm font-semibold text-gray-900">{stats.conversion_metrics.checkout}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(stats.conversion_metrics.checkout / stats.conversion_metrics.product_views) * 100}%` }}></div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium text-gray-700">Payment Done</span>
                                                        <span className="text-sm font-semibold text-gray-900">{stats.conversion_metrics.payment_done}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(stats.conversion_metrics.payment_done / stats.conversion_metrics.product_views) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Customer Dashboard */
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Account</h3>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {user.email}</p>
                                {user.phone && <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {user.phone}</p>}
                                <p className="text-sm text-gray-600"><span className="font-medium">Member Since:</span> {new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    if (isAdmin) {
        return (
            <AdminLayout header="Dashboard">
                {dashboardContent}
            </AdminLayout>
        );
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}>
            {dashboardContent}
        </AuthenticatedLayout>
    );
}
