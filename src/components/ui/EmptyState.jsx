import React from 'react';
import { Plus } from 'lucide-react';

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-surface-footer flex items-center justify-center mb-4">
        {Icon && <Icon className="w-6 h-6 text-text-muted" />}
      </div>
      <h3 className="text-[14px] font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-[13px] text-text-muted mb-5 max-w-[280px]">{description}</p>
      {actionLabel && (
        <button className="btn-primary" onClick={onAction}>
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
