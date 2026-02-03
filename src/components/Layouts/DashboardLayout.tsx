import React, { ReactNode, useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { AppView } from '../../App';
import { BaseLayoutHeader } from './BaseLayoutHeader';

interface DashboardLayoutProps {
  currentView: string;
  mobileNavOpen?: boolean;
  viewLabels: Record<string, string>;
  appName?: string;
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  onNavigate?: (view: AppView) => void;
  onLogout?: () => void;
  onMobileNavOpen: (str: boolean) => void;
  mainClassName?: string;
}

export function DashboardLayout({
  currentView,
  mobileNavOpen,
  viewLabels,
  appName = 'RailBit',
  sidebar,
  header,
  children,
  onNavigate,
  onMobileNavOpen,
  onLogout,
  mainClassName = '',
}: DashboardLayoutProps) {

  return (
    <div className="relative h-screen flex bg-gray-50 overflow-y-auto">

    {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 z-50 bg-black/50"
            onClick={() => onMobileNavOpen(false)}
          />
          <div className="absolute left-0 top-0 z-[60] h-full w-80 max-w-[85vw] bg-gray-900 text-white shadow-xl">
              {sidebar}
          </div>
        </div>
      )}

      {/* <div className="sidebars hidden md:block">{sidebar}</div> */}
      {sidebar}

      <div className='flex flex-col flex-1 '>
          <div className="headers">{header}</div>
          <main
              className={` flex-1 w-full overflow-y-auto ${
                mobileNavOpen ? 'pointer-events-none' : ''
              } ${mainClassName}`}
              aria-hidden={mobileNavOpen}
            >
              {children}
          </main>
      </div>
    </div>
  );
}