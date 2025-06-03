import React, { useState, MouseEvent } from "react";
import CustomRadio from "../custom-radio/CustomRadio";
import { SpinnerLoadingSmall } from "../loading-small/SpinnerLoading";

interface Action<T> {
  render: ((row: T) => React.ReactNode) | React.ReactNode;
  onClick: (row: T) => void;
}

export interface Column<T> {
  key: keyof T | "action";
  title?: string;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  actions?: Action<T>[];
  fixed?: "right" | "left";
  width?: number;
}

interface TableProps<T extends { id: number }> {
  columns: Column<T>[];
  data: T[];
  isDataLoading?: boolean;
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
  isDataLoading = false,
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
    const isActive = sortBy === key;

    return (
      <div className="flex flex-col items-center text-sm sm:text-base leading-none">
        <i
          className={`fa-solid fa-caret-up ${isActive && orderBy === "asc" ? "text-[#CF2338]" : "text-gray-400"
            }`}
        />
        <i
          className={`fa-solid fa-caret-down ${isActive && orderBy === "desc" ? "text-[#CF2338]" : "text-gray-400"
            }`}
        />
      </div>
    );
  };

  const calculateOffsets = () => {
    let leftOffset = isSelect ? 40 : 0;
    let rightOffset = 0;
    const offsets: { [key: string]: { left?: number; right?: number } } = {};

    columns.forEach((column) => {
      const colWidth = column.width || 80;
      if (column.fixed === "left") {
        offsets[column.key as string] = { left: leftOffset };
        leftOffset += colWidth;
      } else if (column.fixed === "right") {
        offsets[column.key as string] = { right: rightOffset };
        rightOffset += colWidth;
      }
    });

    return offsets;
  };

  const offsets = calculateOffsets();

  return (
    <div className="min-w-[430px] w-full grow overflow-x-auto">
      <table className="relative w-full border-collapse">
        <thead className="w-full sticky top-0 bg-white z-10">
          <tr>
            {isSelect && <th className={`w-10 ${columns.some((col) => col.fixed === "left")
              ? "sticky left-0 bg-white shadow-right"
              : ""
              }`}></th>}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={[
                  "px-2 py-3 text-left text-lg sm:text-[1.4rem] md:text-[1.5rem] lg:text-[1.6rem] font-bold text-gray-900",
                  column.key === "action"
                    ? "w-0 whitespace-nowrap text-center"
                    : "",
                  column.key !== "action" ? "cursor-pointer" : "",
                  column.fixed ? `sticky bg-white` : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  ...(column.fixed === "left" && {
                    left: offsets[column.key as string]?.left,
                  }),
                  ...(column.fixed === "right" && {
                    right: offsets[column.key as string]?.right,
                  }),
                  ...(column.width && { width: column.width, minWidth: column.width }),
                }}
                onClick={
                  column.key !== "action"
                    ? () => handleSort(column.key as keyof T)
                    : undefined
                }
              >
                <div className="flex flex-col w-full">
                  <div className="flex items-center gap-2.5 whitespace-nowrap">
                    {column.title}
                    {column.title &&
                      column.key !== "action" &&
                      isSort &&
                      getSortIcon(column.key as keyof T)}
                  </div>

                  {
                    column.title && <div className="h-[2px] bg-[#d1d5db] mt-2"></div>
                  }
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={row.id ?? index}
                className="cursor-pointer"
                onClick={() => onRowClick?.(row.id)}
              >
                {isSelect && (
                  <td className={`text-center ${columns.some((col) => col.fixed === "left")
                    ? "sticky left-0 bg-white shadow-right"
                    : ""
                    }`}>
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
                      "px-3 pb-2 pt-4 text-base sm:text-lg md:text-[1.5rem] lg:text-[1.6rem] text-gray-900 max-w-[200px] truncate",
                      column.fixed ? `sticky bg-white` : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={{
                      ...(column.fixed === "left" && {
                        left: offsets[column.key as string]?.left,
                      }),
                      ...(column.fixed === "right" && {
                        right: offsets[column.key as string]?.right,
                      }),
                      ...(column.width && { width: column.width, minWidth: column.width }),
                    }}
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
                    {!column.actions && <div className="h-[2px] bg-[#e5e7eb] mt-2.5"></div>}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isSelect ? columns.length + 1 : columns.length}>
                <div className="flex justify-center text-lg sm:text-[1.4rem] md:text-[1.5rem] mt-4 lg:text-[1.6rem] font-bold text-gray-900">
                  {
                    isDataLoading ? (
                      <SpinnerLoadingSmall />
                    ) : (
                      <span>
                        No results found
                      </span>
                    )
                  }
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

