import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CartIcon() {
    const { props } = usePage();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Get cart count from props
        if (props.cartCount !== undefined) {
            setCartCount(props.cartCount);
        }
    }, [props.cartCount]);

    return (
        <Link
            href={route('cart.index')}
            className="relative inline-flex items-center text-gray-500 transition duration-150 ease-in-out hover:text-gray-700"
        >
            <i className="fas fa-shopping-cart text-2xl"></i>
            {cartCount > 0 && (
                <span className="absolute -right-3 -top-3 inline-flex items-center justify-center rounded-full bg-red-600 w-6 h-6 text-xs font-bold leading-none text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            )}
        </Link>
    );
}
