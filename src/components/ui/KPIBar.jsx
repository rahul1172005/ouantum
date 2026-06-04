import React from 'react';

export function KPIBar({ metrics }) {
  // metrics = [{ label, value, trend, trendDir }]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {metrics.map(({ label, value, trend, trendDir }) => (
        <div key={label} className="zoho-card p-4">
          <p className="text-[12px] text-text-muted mb-1">{label}</p>
          <p className="text-[22px] font-medium text-text-primary font-mono leading-tight">{value}</p>
          {trend && (
            <p className={`text-[12px] mt-1 flex items-center gap-1 ${trendDir === 'up' ? 'text-text-success' : 'text-text-danger'}`}>
              <span>{trendDir === 'up' ? '↑' : '↓'}</span>
              <span>{trend}</span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
