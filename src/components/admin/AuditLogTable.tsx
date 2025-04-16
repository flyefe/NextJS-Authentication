import React from "react";

interface AuditLog {
  _id?: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}

interface AuditLogTableProps {
  logs: AuditLog[];
}

export default function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-blue-100 text-blue-900">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">User</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Target</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Timestamp</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={log._id || i} className={i % 2 === 0 ? "bg-gray-50 hover:bg-blue-50" : "bg-white hover:bg-blue-50"}>
              <td className="px-4 py-3 whitespace-nowrap text-gray-700">{log.user}</td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-700">{log.action}</td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-700">{log.target}</td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-700">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-700">{log.details || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
