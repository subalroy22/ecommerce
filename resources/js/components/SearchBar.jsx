import { useState } from 'react';

export default function SearchBar({ initialValue = '', onSearch, placeholder = 'Search...' }) {
    const [searchTerm, setSearchTerm] = useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="block w-full rounded-md border-gray-300 pl-10 pr-20 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-16 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
                <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center rounded-r-md bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
