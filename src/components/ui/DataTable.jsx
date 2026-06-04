'use client';
import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

export function DataTable({ columns, rows, onRowClick }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [selected, setSelected] = useState([]);

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(rows.map((r, i) => r.id ?? i));
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (e, id) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelected(prev => [...prev, id]);
    } else {
      setSelected(prev => prev.filter(item => item !== id));
    }
  };

  const sortedRows = React.useMemo(() => {
    if (!sortCol) return rows;
    const sorted = [...rows].sort((a, b) => {
      const aVal = a[sortCol];
      const bVal = b[sortCol];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [rows, sortCol, sortDir]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="bg-surface-header border-b border-border-default">
            <th className="w-10 px-3 py-0 h-[40px] text-center">
              <input 
                type="checkbox" 
                onChange={handleSelectAll}
                checked={rows.length > 0 && selected.length === rows.length}
                className="w-3.5 h-3.5 rounded-[8px] border-border-input cursor-pointer" 
              />
            </th>
            {columns.map(col => (
              <th
                key={col.key}
                className="px-3 h-[40px] text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wide cursor-pointer select-none"
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  <span>{col.label}</span>
                  <span className="text-text-muted opacity-50">
                    {sortCol === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                  </span>
                </div>
              </th>
            ))}
            <th className="w-12 px-3 h-[40px]" />
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => {
            const rowId = row.id ?? i;
            const isRowSelected = selected.includes(rowId);
            return (
              <tr
                key={rowId}
                className={`border-b border-[#e0e0e0] hover:bg-surface-hover cursor-pointer transition-colors ${
                  isRowSelected ? 'bg-surface-hover' : 'bg-surface-body'
                }`}
                onClick={() => onRowClick?.(row)}
              >
                <td className="px-3 py-0 h-[40px] text-center" onClick={e => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={isRowSelected}
                    onChange={(e) => handleSelectRow(e, rowId)}
                    className="w-3.5 h-3.5 rounded-[8px] border-border-input cursor-pointer" 
                  />
                </td>
                {columns.map(col => (
                  <td key={col.key} className={`px-3 h-[40px] text-text-primary ${col.mono ? 'font-mono text-[12px]' : ''}`}>
                    {row[col.key]}
                  </td>
                ))}
                <td className="px-3 h-[40px]" onClick={e => e.stopPropagation()}>
                  <button className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-surface-footer text-text-muted cursor-pointer border-none bg-transparent">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
