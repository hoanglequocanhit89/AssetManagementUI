import React, { useState, MouseEvent } from 'react';

interface Action<T> {
    render: ((row: T) => React.ReactNode) | React.ReactNode;
    onClick: (row: T) => void;
}

export interface Column<T> {
    key: keyof T | 'action';
    title?: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
    actions?: Action<T>[];
}

interface TableProps<T extends { id: number }> {
    columns: Column<T>[];
    data: T[];
    onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
    onRowClick?: (id: number) => void;
}

const Table = <T extends { id: number }>({
    columns,
    data,
    onSort,
    onRowClick,
}: TableProps<T>) => {
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T | null;
        direction: 'asc' | 'desc' | null;
    }>({
        key: null,
        direction: null,
    });

    const handleSort = (key: keyof T) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';

        setSortConfig({ key, direction });
        onSort?.(key, direction);
    };

    const getSortIcon = (key: keyof T) => {
        const isActive = sortConfig.key === key;

        return (
            <div className="flex flex-col items-center text-sm sm:text-base leading-none">
                <i
                    className={`fa-solid fa-caret-up ${isActive && sortConfig.direction === 'asc' ? 'text-[#CF2338]' : 'text-gray-400'
                        }`}
                />
                <i
                    className={`fa-solid fa-caret-down ${isActive && sortConfig.direction === 'desc' ? 'text-[#CF2338]' : 'text-gray-400'
                        }`}
                />
            </div>
        );
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-separate border-spacing-x-2">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className={[
                                    'py-2 text-left text-lg sm:text-xl md:text-2xl font-bold text-gray-900',
                                    column.key !== 'action' ? 'cursor-pointer' : '',
                                    column.title ? 'border-b-2 border-black-900' : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                onClick={column.key !== 'action' ? () => handleSort(column.key as keyof T) : undefined}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    {column.title}
                                    {column.title && column.key !== 'action' && getSortIcon(column.key as keyof T)}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={row.id}
                            className="cursor-pointer"
                            onClick={() => onRowClick?.(row.id)}
                        >
                            {columns.map((column) => (
                                <td
                                    key={String(column.key)}
                                    className={[
                                        'py-2 text-base sm:text-lg md:text-xl text-gray-900 max-w-[200px] truncate',
                                        column.title ? 'border-b-2 border-black-900' : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                    title={column.key !== 'action' ? String(row[column.key as keyof T]) : undefined}
                                >
                                    {column.key === 'action' && column.actions ? (
                                        <div className="flex gap-2">
                                            {column.actions.map((action, index) => (
                                                <div
                                                    key={index}
                                                    onClick={(e: MouseEvent) => {
                                                        e.stopPropagation();
                                                        action.onClick(row);
                                                    }}
                                                >
                                                    {typeof action.render === 'function'
                                                        ? action.render(row)
                                                        : action.render}
                                                </div>
                                            ))}
                                        </div>
                                    ) : column.render ? (
                                        column.render(row[column.key as keyof T], row)
                                    ) : (
                                        String(row[column.key as keyof T])
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;