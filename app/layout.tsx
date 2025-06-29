import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TaskProvider } from '@/contexts/TaskContext';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QA Monitor Tool',
  description: 'Quality Assurance Task Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TaskProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
          <Toaster />
        </TaskProvider>
      </body>
    </html>
  );
}