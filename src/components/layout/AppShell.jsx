'use client';
import React from 'react';
import { Sidebar } from './Sidebar';

export function AppShell({ children, sidebarOpen, setSidebarOpen, setHelpOpen, onExit }) {
  return (
    <div className="h-screen overflow-hidden bg-surface-page relative text-text-primary flex flex-col font-sans">
      
      {/* Main Grid Wrapper */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} setHelpOpen={setHelpOpen} onExit={onExit} />
        
        {/* Workspace panel and inspector wrapper */}
        <div
          className={`flex-1 flex flex-col lg:flex-row transition-all duration-200 min-h-0 overflow-hidden relative ${
            sidebarOpen ? 'ml-[304px]' : 'ml-[64px]'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
