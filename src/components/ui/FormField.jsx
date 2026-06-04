import React from 'react';

export function FormField({ label, hint, error, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-text-secondary">
        {label}
        {required && <span className="text-text-danger ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[12px] text-text-muted mt-0.5">{hint}</p>
      )}
      {error && (
        <p className="text-[12px] text-text-danger flex items-center gap-1 mt-0.5 font-medium">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
