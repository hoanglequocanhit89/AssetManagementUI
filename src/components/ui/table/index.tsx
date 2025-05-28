import React, { useState, MouseEvent } from "react";
import CustomRadio from "../CustomRadio";

interface Action<T> {
  render: ((row: T) => React.ReactNode) | React.ReactNode;
  onClick: (row: T) => void;
}

export interface Column<T> {
  key: keyof T | "action";
  title?: string;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  actions?: Action<T>[];
}

interface TableProps<T extends { id: number }> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  onRowClick?: (id: number) => void;
  isSort?: boolean;
  sortBy?: keyof T;
  orderBy?: string;
  isSelect?: boolean;
  onSelected?: (row: T) => void;
  selectedObject?: T;
}

const Table = <T extends { id: number }>({
  columns,
  data,
  onSort,
  onRowClick,
  isSort = true,
  sortBy,
  orderBy,
  isSelect = false,
  onSelected,
  selectedObject,
}: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });

  const [selectedRow, setSelectedRow] = useState<T | undefined>(selectedObject);

  const handleSort = (key: keyof T) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";

    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  const getSortIcon = (key: keyof T) => {
    // const isActive = sortConfig.key === key;
    const isActive = sortBy === key;

    return (
      <div className="flex flex-col items-center text-sm sm:text-base leading-none">
        <i
          className={`fa-solid fa-caret-up ${
            isActive && orderBy === "asc" ? "text-[#CF2338]" : "text-gray-400"
          }`}
        />
        <i
          className={`fa-solid fa-caret-down ${
            isActive && orderBy === "desc" ? "text-[#CF2338]" : "text-gray-400"
          }`}
        />
      </div>
    );
  };

  return (
    <div className="w-full grow overflow-y-auto">
      <table className="relative w-full border-separate border-spacing-x-[10px] border-spacing-y-[10px]">
        <thead className="w-full sticky top-0 bg-white">
          <tr>
            {isSelect && <th className="w-10"></th>}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={[
                  "py-2 text-left text-lg sm:text-[1.4rem] md:text-[1.5rem] lg:text-[1.6rem] font-bold text-gray-900",
                  column.key === "action"
                    ? "w-0 whitespace-nowrap text-center"
                    : "",
                  column.key !== "action" ? "cursor-pointer" : "",
                  column.title ? "border-b-2 border-[#d1d5db]" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={
                  column.key !== "action"
                    ? () => handleSort(column.key as keyof T)
                    : undefined
                }
              >
                <div className="flex items-center gap-2 whitespace-nowrap">
                  {column.title}
                  {column.title &&
                    column.key !== "action" &&
                    isSort &&
                    getSortIcon(column.key as keyof T)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id ?? index}
              className="cursor-pointer"
              onClick={() => onRowClick?.(row.id)}
            >
              {isSelect && (
                <td className="text-center">
                  <div className="flex justify-center">
                    <CustomRadio
                      checked={selectedRow?.id === row.id}
                      onChange={() => {
                        setSelectedRow(row);
                        onSelected?.(row);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={[
                    column.key === "action"
                      ? "w-0 whitespace-nowrap text-center"
                      : "",
                    "pb-2 pt-4 text-base sm:text-lg md:text-[1.5rem] lg:text-[1.6rem] text-gray-900 max-w-[200px] truncate",
                    column.title ? "border-b-2 border-[#e5e7eb]" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  title={
                    column.key !== "action"
                      ? String(row[column.key as keyof T])
                      : undefined
                  }
                >
                  {column.key === "action" && column.actions ? (
                    <div className="flex justify-end w-full">
                      <div
                        className="flex justify-between gap-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {column.actions.map((action, index) => (
                          <div
                            className="mx-2 cursor-pointer"
                            key={index}
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                          >
                            {typeof action.render === "function"
                              ? action.render(row)
                              : action.render}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : column.render ? (
                    column.render(row[column.key as keyof T], row, index)
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
