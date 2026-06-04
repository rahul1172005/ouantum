// src/components/ui/ZohoCard.jsx
import React from 'react';

export function ZohoCard({ children, className = '' }) {
  return (
    <div className={`flex flex-col rounded-[8px]-[8px] border border-border-default bg-surface-body shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  );
}

export function ZohoCardHeader({ icon: Icon, title, children }) {
  return (
    <div className="flex items-center gap-2 px-4 h-[42px] bg-gradient-to-b from-[#fbfbfb] to-[#ececec] border-b border-border-header rounded-[8px]-t-[8px] flex-shrink-0">
      {Icon && <Icon className="w-4 h-4 text-text-secondary flex-shrink-0" />}
      <span className="text-[13px] font-semibold text-text-primary uppercase tracking-wide">
        {title}
      </span>
      {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function ZohoCardBody({ children, className = '' }) {
  return (
    <div className={`flex-1 bg-surface-body p-5 ${className}`}>
      {children}
    </div>
  );
}

export function ZohoCardFooter({ children }) {
  return (
    <div className="flex items-center px-4 h-[38px] bg-surface-footer border-t border-border-default rounded-[8px]-b-[8px] flex-shrink-0">
      <span className="text-[12px] text-text-muted">
        {children}
      </span>
    </div>
  );
}
