import { Navbar } from '@/components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 min-h-[calc(100vh-4rem)]">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-6">
              {children}
            </div>
          </div>
        </main>
      </div>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ProductiveFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}