import React from 'react';

const AdminTable = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="min-w-full text-left text-white">
        <thead className="bg-white/5 text-indigo-300">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-white/5 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;