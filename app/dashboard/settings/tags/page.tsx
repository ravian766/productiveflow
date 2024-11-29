import { TagsManager } from '@/components/TagsManager';

export default function TagsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Tags</h1>
        <p className="text-sm text-gray-500">
          Create and manage tags to organize your tasks and projects
        </p>
      </div>
      <TagsManager />
    </div>
  );
}
