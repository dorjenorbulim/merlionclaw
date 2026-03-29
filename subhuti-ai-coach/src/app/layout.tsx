import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subhuti AI Coach — Buddhist-Informed Mindfulness Coaching',
  description: 'AI coaching with persistent memory, daily accountability, and mindfulness-based burnout recovery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <header className="border-b bg-white">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🪷</span>
                <h1 className="text-xl font-semibold text-gray-900">Subhuti AI Coach</h1>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                <a href="/checkin" className="text-gray-600 hover:text-gray-900">Daily Check-in</a>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t bg-white mt-16">
            <div className="container mx-auto px-4 py-8 text-center text-gray-600">
              <p>Built with wisdom, compassion, and skillful means 🪷</p>
              <p className="text-sm mt-2">© 2026 Subhuti AI Coach</p>
            </footer>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
