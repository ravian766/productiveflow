'use client';

import { useState } from 'react';
import { TagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Tag {
  id: string;
  name: string;
  color: string;
}

export function TagsManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#4F46E5'); // Default indigo color
  const [error, setError] = useState('');

  // Fetch existing tags
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to load tags');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new tag
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTagName,
          color: newTagColor,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create tag');
      }

      const newTag = await response.json();
      setTags([...tags, newTag]);
      setNewTagName('');
      toast.success('Tag created successfully');
    } catch (error) {
      console.error('Error creating tag:', error);
      setError(error instanceof Error ? error.message : 'Failed to create tag');
      toast.error('Failed to create tag');
    }
  };

  // Delete a tag
  const handleDeleteTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete tag');
      setTags(tags.filter(tag => tag.id !== tagId));
      toast.success('Tag deleted successfully');
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
    }
  };

  // Load tags on component mount
  useState(() => {
    fetchTags();
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Tag</h2>
        <form onSubmit={handleCreateTag} className="space-y-4">
          <div>
            <label htmlFor="tagName" className="block text-sm font-medium text-gray-700">
              Tag Name
            </label>
            <input
              type="text"
              id="tagName"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter tag name"
              required
            />
          </div>
          <div>
            <label htmlFor="tagColor" className="block text-sm font-medium text-gray-700">
              Tag Color
            </label>
            <input
              type="color"
              id="tagColor"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Tag
          </button>
        </form>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Existing Tags</h2>
        {tags.length === 0 ? (
          <p className="text-gray-500">No tags created yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-3 rounded-md border"
                style={{ borderColor: tag.color }}
              >
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-5 w-5" style={{ color: tag.color }} />
                  <span className="text-gray-900">{tag.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
