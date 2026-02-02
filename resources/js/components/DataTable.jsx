import { Link } from '@inertiajs/react';

export default function DataTable({ columns, data, actions, onSort, sortBy, sortOrder }) {
    const handleSort = (field) => {
        if (onSort) {
            // Toggle sort order if clicking the same column
            let newOrder = 'asc';
            if (sortBy === field && sortOrder === 'asc') {
                newOrder = 'desc';
            }
            onSort(field, newOrder);
        }
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) {
            return (
                <svg className="ml-1 inline h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        if (sortOrder === 'asc') {
            return (
                <svg className="ml-1 inline h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14l5-5 5 5z" />
                </svg>
            );
        }
        return (
            <svg className="ml-1 inline h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z" />
            </svg>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                onClick={() => column.sortable !== false && handleSort(column.field)}
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                                    }`}
                            >
                                <div className="flex items-center">
                                    {column.label}
                                    {column.sortable !== false && getSortIcon(column.field)}
                                </div>
                            </th>
                        ))}
                        {actions && (
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data && data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                                    >
                                        {column.render
                                            ? column.render(row)
                                            : row[column.field]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            {actions(row)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 1 : 0)}
                                className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
