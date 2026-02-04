import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function Checkout({ cartItems, subtotal, user }) {
    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, errors } = useForm({
        payment_method: 'cod',
        shipping_address: {
            name: user.name || '',
            email: user.email || '',
            phone: '',
            address: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
        },
        billing_address: {
            name: user.name || '',
            email: user.email || '',
            phone: '',
            address: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
        },
        notes: '',
        tax: 0,
        shipping: 0,
        discount: 0,
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(price);
    };

    const total = subtotal + parseFloat(data.tax) + parseFloat(data.shipping) - parseFloat(data.discount);

    const handleAddressChange = (type, field, value) => {
        setData(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value,
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        post(route('order.store'), {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Checkout" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Shipping Address */}
                                <div className="rounded-lg bg-white p-6 shadow">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Shipping Address</h2>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="shipping_name" value="Full Name" />
                                            <TextInput
                                                id="shipping_name"
                                                type="text"
                                                value={data.shipping_address.name}
                                                onChange={(e) => handleAddressChange('shipping_address', 'name', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors['shipping_address.name']} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="shipping_email" value="Email" />
                                            <TextInput
                                                id="shipping_email"
                                                type="email"
                                                value={data.shipping_address.email}
                                                onChange={(e) => handleAddressChange('shipping_address', 'email', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors['shipping_address.email']} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="shipping_phone" value="Phone" />
                                            <TextInput
                                                id="shipping_phone"
                                                type="tel"
                                                value={data.shipping_address.phone}
                                                onChange={(e) => handleAddressChange('shipping_address', 'phone', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors['shipping_address.phone']} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="shipping_country" value="Country" />
                                            <TextInput
                                                id="shipping_country"
                                                type="text"
                                                value={data.shipping_address.country}
                                                onChange={(e) => handleAddressChange('shipping_address', 'country', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors['shipping_address.country']} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <InputLabel htmlFor="shipping_address" value="Address" />
                                            <TextInput
                                                id="shipping_address"
                                                type="text"
                                                value={data.shipping_address.address}
                                                onChange={(e) => handleAddressChange('shipping_address', 'address', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors['shipping_address.address']} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="shipping_city" value="City" />
                                            <TextInput
                                                id="shipping_city"
                                                type="text"
                                                value={data.shipping_address.city}
                                                onChange={(e) => handleAddressChange('shipping_address', 'city', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors['shipping_address.city']} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="shipping_state" value="State/Province" />
                                            <TextInput
                                                id="shipping_state"
                                                type="text"
                                                value={data.shipping_address.state}
                                                onChange={(e) => handleAddressChange('shipping_address', 'state', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors['shipping_address.state']} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="shipping_postal_code" value="Postal Code" />
                                            <TextInput
                                                id="shipping_postal_code"
                                                type="text"
                                                value={data.shipping_address.postal_code}
                                                onChange={(e) => handleAddressChange('shipping_address', 'postal_code', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors['shipping_address.postal_code']} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="rounded-lg bg-white p-6 shadow">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Payment Method</h2>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="cod"
                                                checked={data.payment_method === 'cod'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="h-4 w-4 text-indigo-600"
                                            />
                                            <span className="ml-3 text-gray-700">Cash on Delivery</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="card"
                                                checked={data.payment_method === 'card'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="h-4 w-4 text-indigo-600"
                                            />
                                            <span className="ml-3 text-gray-700">Credit/Debit Card (Coming Soon)</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="paypal"
                                                checked={data.payment_method === 'paypal'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="h-4 w-4 text-indigo-600"
                                            />
                                            <span className="ml-3 text-gray-700">PayPal (Coming Soon)</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                <div className="rounded-lg bg-white p-6 shadow">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Order Notes (Optional)</h2>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Add any special instructions for your order..."
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        rows="4"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <SecondaryButton href={route('cart.index')}>
                                        Back to Cart
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Processing...' : 'Place Order'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="rounded-lg bg-white p-6 shadow sticky top-20">
                                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="mt-6 space-y-3 border-b border-gray-200 pb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.product.name} x {item.quantity}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="mt-6 space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium text-gray-900">
                                            {formatPrice(data.shipping)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium text-gray-900">
                                            {formatPrice(data.tax)}
                                        </span>
                                    </div>

                                    {data.discount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Discount</span>
                                            <span className="font-medium text-green-600">
                                                -{formatPrice(data.discount)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-lg font-bold text-indigo-600">
                                                {formatPrice(total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
