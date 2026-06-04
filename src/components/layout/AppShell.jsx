'use client';
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppShell({ children, sidebarOpen, setSidebarOpen, setHelpOpen }) {
  return (
    <div className="h-screen overflow-hidden bg-surface-page relative text-text-primary flex flex-col font-sans">
      {/* Header */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHelpOpen={setHelpOpen} />
      
      {/* Main Grid Wrapper */}
      <div className="flex flex-1 pt-16 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Workspace panel and inspector wrapper */}
        <div
          className={`flex-1 flex flex-col lg:flex-row transition-all duration-200 min-h-0 overflow-hidden ${
            sidebarOpen ? 'ml-14 md:ml-60' : 'ml-14'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
