import React from "react";

interface DataTableProps<T> {
  columns: { key: keyof T; label: string; render?: (value: any, row: T) => React.ReactNode }[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
}

export default function DataTable<T extends { _id?: string }>({ columns, data, actions }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-blue-100 text-blue-900">
          <tr>
            {columns.map(col => (
              <th key={String(col.key)} className="px-4 py-3 text-left font-semibold text-gray-700">{col.label}</th>
            ))}
            {actions && <th className="px-4 py-3 text-left font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row._id || i} className={i % 2 === 0 ? "bg-gray-50 hover:bg-blue-50" : "bg-white hover:bg-blue-50"}>
              {columns.map(col => (
                <td key={String(col.key)} className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && <td className="px-4 py-3 whitespace-nowrap">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
