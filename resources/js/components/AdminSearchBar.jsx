import { useState } from 'react';

export default function AdminSearchBar({ initialValue = '', onSearch, placeholder = 'Search...' }) {
    const [searchTerm, setSearchTerm] = useState(initialValue);

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        if (onSearch) {
            onSearch('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex gap-2">
            <div className="relative flex-1">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            <button
                onClick={handleSearch}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
                Search
            </button>
        </div>
    );
}
