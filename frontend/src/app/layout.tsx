import './globals.css';
import React from 'react';
import { AuthProvider } from '@/lib/auth';

export const metadata = {
  title: 'Research2Reality AI - Turn Research Papers into Real Projects & Startups',
  description: 'Production-quality AI SaaS platform converting research papers into real projects, innovations, experiments, startups, code, and reports.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-slate-100 min-h-screen antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
