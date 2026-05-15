import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'NexusFlow — AI-Powered Workflow Intelligence',
  description: 'Enterprise-grade, AI-powered platform for real-time team collaboration, intelligent workflow automation, and predictive analytics.',
  keywords: ['workflow', 'AI', 'project management', 'collaboration', 'analytics'],
  openGraph: {
    title: 'NexusFlow — AI-Powered Workflow Intelligence',
    description: 'Transform how your team collaborates with AI-driven workflow automation.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
