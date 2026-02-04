"use client";
import React from "react";

export type Column<T> = {
  label: string;
  key: keyof T;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  onAction: (row: T) => void;
};

export default function Table<T>({
  columns,
  data,
  onAction,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full min-w-[900px]">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-sm">
                  {col.render ? col.render(row) : String(row[col.key])}
                </td>
              ))}
              <td className="px-4 py-3">
                <button
                  onClick={() => onAction(row)}
                  className="rounded-md border border-blue-600 px-4 py-1.5 text-sm text-blue-600 hover:bg-blue-600 hover:text-white transition"
                >
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
