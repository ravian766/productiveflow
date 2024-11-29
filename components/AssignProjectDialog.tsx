'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FolderIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
}

interface AssignProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  onAssign: (projectId: string) => Promise<void>;
  currentProjects: Project[];
}

export function AssignProjectDialog({
  isOpen,
  onClose,
  teamId,
  onAssign,
  currentProjects,
}: AssignProjectDialogProps) {
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        
        // Filter out projects that are already assigned to the team
        const currentProjectIds = new Set(currentProjects.map(p => p.id));
        const filteredProjects = data.filter((project: Project) => !currentProjectIds.has(project.id));
        
        setAvailableProjects(filteredProjects);
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen, currentProjects]);

  const handleAssign = async (projectId: string) => {
    try {
      await onAssign(projectId);
      onClose();
    } catch (error) {
      console.error('Error assigning project:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6 w-full">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Assign Project to Team
          </Dialog.Title>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading projects...</p>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm mb-4">
              {error}
            </div>
          )}

          {!loading && !error && availableProjects.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No available projects to assign
            </p>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleAssign(project.id)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <FolderIcon className="h-6 w-6 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {project.name}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
