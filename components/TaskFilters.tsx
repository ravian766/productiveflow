'use client';

import { useState, useEffect } from 'react';
import { TaskPriority, TaskStatus, TaskSort, TaskFilters as ITaskFilters } from '@/types';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TaskFiltersProps {
  users: User[];
  tags: Tag[];
  onFilterChange: (filters: ITaskFilters) => void;
  onSortChange: (sort: TaskSort) => void;
}

export default function TaskFilters({ users, tags, onFilterChange, onSortChange }: TaskFiltersProps) {
  const [filters, setFilters] = useState<ITaskFilters>({
    assignee: undefined,
    priority: undefined,
    tags: [],
    searchQuery: '',
  });

  const [sort, setSort] = useState<TaskSort>({
    field: 'dueDate',
    direction: 'asc',
  });

  const handleFilterChange = (newFilters: Partial<ITaskFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSortChange = (field: TaskSort['field']) => {
    const newSort: TaskSort = {
      field,
      direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc',
    };
    setSort(newSort);
    onSortChange(newSort);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
          />
        </div>

        {/* Assignee Filter */}
        <div className="w-48">
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.assignee || ''}
            onChange={(e) => handleFilterChange({ assignee: e.target.value || undefined })}
          >
            <option value="">All Assignees</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="w-48">
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange({ priority: e.target.value as TaskPriority || undefined })}
          >
            <option value="">All Priorities</option>
            {Object.values(TaskPriority).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="w-48">
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={`${sort.field}-${sort.direction}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-') as [TaskSort['field'], TaskSort['direction']];
              setSort({ field, direction });
              onSortChange({ field, direction });
            }}
          >
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="dueDate-desc">Due Date (Latest)</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="priority-asc">Priority (Low to High)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => {
              const newTags = filters.tags.includes(tag.id)
                ? filters.tags.filter((id) => id !== tag.id)
                : [...filters.tags, tag.id];
              handleFilterChange({ tags: newTags });
            }}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filters.tags.includes(tag.id)
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
