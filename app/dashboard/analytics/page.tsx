import { Metadata } from 'next';
import GlobalAnalytics from '@/components/GlobalAnalytics';

export const metadata: Metadata = {
  title: 'Analytics | ProductiveFlow',
  description: 'View comprehensive analytics for all your tasks and projects',
};

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Comprehensive overview of all tasks and projects
        </p>
      </div>
      <GlobalAnalytics />
    </div>
  );
}
