'use client';

import { useState, useEffect } from 'react';
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
  const [newTagColor, setNewTagColor] = useState('#4F46E5');
  const [error, setError] = useState('');

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

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName, color: newTagColor }),
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

  const handleDeleteTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/tags/${tagId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete tag');
      setTags(tags.filter(tag => tag.id !== tagId));
      toast.success('Tag deleted successfully');
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
    }
  };

  useEffect(() => { fetchTags(); }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-sm rounded-lg p-4">
        <form onSubmit={handleCreateTag} className="flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-1">
              Tag Name
            </label>
            <input
              type="text"
              id="tagName"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter tag name"
              required
            />
          </div>
          <div className="w-32">
            <label htmlFor="tagColor" className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              id="tagColor"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="h-9 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
          <button
            type="submit"
            className="h-9 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Tag
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Tags</h2>
        {tags.length === 0 ? (
          <p className="text-gray-500">No tags created yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-2 rounded-md border group hover:shadow-sm transition-shadow"
                style={{ borderColor: tag.color }}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span className="text-gray-900 truncate">{tag.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
