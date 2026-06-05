// src/components/ui/ZohoCard.jsx
import React from 'react';

export function ZohoCard({ children, className = '' }) {
  return (
    <div className={`zoho-card flex flex-col ${className}`}>
      {children}
    </div>
  );
}

export function ZohoCardHeader({ title, children }) {
  return (
    <div className="zoho-card-header">
      <span>{title}</span>
      {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function ZohoCardBody({ children, className = '' }) {
  return (
    <div className={`zoho-card-body ${className}`}>
      {children}
    </div>
  );
}

export function ZohoCardFooter({ children }) {
  return (
    <div className="zoho-card-footer">
      <span>{children}</span>
    </div>
  );
}
