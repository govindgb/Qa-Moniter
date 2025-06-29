'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Create Task', href: '/' },
    { name: 'Test Task', href: '/test-task' },
    { name: 'Task History', href: '/task-history' }
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-orange-500 text-xl font-bold">×</div>
              <span className="text-xl font-semibold text-gray-900">QAMonitorTool</span>
            </Link>
          </div>
          
          <nav className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;