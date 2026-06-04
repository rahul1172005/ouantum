'use client';
import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Deal with Acme Corp moved to Proposal stage', time: '2 min ago', read: false },
  { id: 2, text: 'Riya Sharma replied to your email',           time: '18 min ago', read: false },
  { id: 3, text: 'Task "Follow up with TechCo" is due today',   time: '1 hr ago', read: true },
];

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        className="relative w-8 h-8 flex items-center justify-center rounded hover:bg-surface-hover text-text-secondary cursor-pointer border-none bg-transparent"
        onClick={() => setOpen(o => !o)}
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-btn-danger rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-[320px] zoho-card z-50 shadow-lg bg-surface-body">
          <div className="zoho-card-header flex items-center justify-between">
            <span className="text-[13px] font-semibold uppercase tracking-wide">Notifications</span>
            <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary border-none bg-transparent cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className={`px-4 py-3 border-b border-border-default text-[13px] ${!n.read ? 'bg-state-info' : ''}`}>
                <p className="text-text-primary leading-snug">{n.text}</p>
                <p className="text-[12px] text-text-muted mt-1">{n.time}</p>
              </div>
            ))}
          </div>
          <div className="zoho-card-footer flex items-center justify-between">
            <button 
              onClick={markAllRead} 
              className="text-[12px] text-btn-primary hover:underline border-none bg-transparent cursor-pointer font-medium"
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
