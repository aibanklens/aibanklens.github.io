import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Canada Big-6 AI Risk Tracker',
  description: 'OSFI-based AI & Cloud Risk Dashboard for Canada\'s Big-6 Banks (2020–2025)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js" defer />
      </head>
      <body>{children}</body>
    </html>
  );
}