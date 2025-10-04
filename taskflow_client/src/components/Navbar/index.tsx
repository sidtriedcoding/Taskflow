'use client';
import React, { useEffect, useState } from 'react';
import { Settings, Search, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import GlobalSearch from '@/components/GlobalSearch';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Navbar = ({ onToggleSidebar, isSidebarCollapsed }: NavbarProps) => {
  const [mounted, setMounted] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut for global search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9"></div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            TASKFLOW
          </h1>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9"></div>
          <div className="w-9 h-9"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
      {/* Left section with menu button and logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>

        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          TASKFLOW
        </h1>
      </div>

      {/* Center section with search */}
      <div className="flex-1 flex justify-center max-w-2xl mx-auto">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-full pl-10 pr-20 py-1.5 text-sm text-gray-900 dark:text-gray-100 
                     border border-gray-200 dark:border-gray-700 rounded-lg
                     bg-gray-50 dark:bg-gray-800 
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 
                     focus:border-blue-500 dark:focus:border-blue-600 
                     placeholder-gray-500 dark:placeholder-gray-400
                     outline-none cursor-pointer"
            placeholder="Search tasks, projects, users..."
            aria-label="Global Search"
            onClick={() => setIsGlobalSearchOpen(true)}
            readOnly
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded dark:bg-gray-600 dark:text-gray-400 dark:border-gray-500">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right section with theme toggle and settings */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
        <button
          className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
