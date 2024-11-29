import { TagsManager } from '@/components/TagsManager';

export default function TagsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Tags</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create and manage tags to organize your tasks and projects.
        </p>
      </div>
      <TagsManager />
    </div>
  );
}
