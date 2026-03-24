"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export type Column<T> = {
  header: string;
  accessor?: keyof T;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode; // ✅ index added
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
};

export default function DataTable<T extends { id: number | string }>({
  data,
  columns,
  pageSize = 5,
}: Props<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // 🔍 Search filter
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  // 🔃 Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [filteredData, sortKey, sortDirection]);

  // 📄 Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* 🔍 Search */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      {/* 📊 Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`p-3 text-left border-b ${
                    col.sortable ? "cursor-pointer" : ""
                  }`}
                  onClick={() =>
                    col.sortable && col.accessor && handleSort(col.accessor)
                  }
                >
                  {col.header}
                  {col.accessor && sortKey === col.accessor && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row, rowIndex) => {
              const globalIndex = rowIndex + (currentPage - 1) * pageSize; // ✅ correct index

              return (
                <tr key={row.id} className="hover:bg-gray-50">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="p-3 border-b">
                      {col.render
                        ? col.render(row, globalIndex)
                        : col.accessor
                          ? (row[col.accessor] as React.ReactNode)
                          : null}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-end gap-2">
        <button
          className="px-3 py-1 border rounded"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="px-3 py-1">
          {currentPage} / {totalPages || 1}
        </span>

        <button
          className="px-3 py-1 border rounded"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
