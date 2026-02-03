import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function WishlistIcon() {
    const { props } = usePage();
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        // Get wishlist count from props
        if (props.wishlistCount !== undefined) {
            setWishlistCount(props.wishlistCount);
        }
    }, [props.wishlistCount]);

    return (
        <Link
            href={route('wishlist.index')}
            className="relative inline-flex items-center text-gray-500 transition duration-150 ease-in-out hover:text-gray-700"
        >
            <i className="fas fa-heart text-2xl"></i>
            {wishlistCount > 0 && (
                <span className="absolute -right-3 -top-3 inline-flex items-center justify-center rounded-full bg-red-600 w-6 h-6 text-xs font-bold leading-none text-white">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
            )}
        </Link>
    );
}
