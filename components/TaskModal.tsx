'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { TimeTracker } from './TimeTracker';
import { Task, TaskStatus, TaskPriority, Project, User, Tag } from '@/types';
import toast from 'react-hot-toast';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  task?: Task;
}

export default function TaskModal({
  isOpen,
  onClose,
  onUpdate,
  task: existingTask,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
      setStatus(existingTask.status);
      setPriority(existingTask.priority);
      setDueDate(existingTask.dueDate ? new Date(existingTask.dueDate).toISOString().split('T')[0] : '');
      setProjectId(existingTask.project?.id || '');
      setAssigneeId(existingTask.assignee?.id || '');
      setSelectedTags(existingTask.tags.map(tag => tag.id));
    } else {
      resetForm();
    }
  }, [existingTask]);

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const [projectsRes, usersRes, tagsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/users'),
        fetch('/api/tags')
      ]);

      const [projectsData, usersData, tagsData] = await Promise.all([
        projectsRes.json(),
        usersRes.json(),
        tagsRes.json()
      ]);

      setProjects(projectsData);
      setUsers(usersData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error fetching form data:', error);
      setError('Failed to load form data');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus(TaskStatus.TODO);
    setPriority(TaskPriority.MEDIUM);
    setDueDate('');
    setProjectId('');
    setAssigneeId('');
    setSelectedTags([]);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      projectId,
      assigneeId,
      tagIds: selectedTags,
    };

    try {
      const url = existingTask 
        ? `/api/tasks/${existingTask.id}`
        : '/api/tasks';
        
      const response = await fetch(url, {
        method: existingTask ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to save task');
      }

      await response.json();
      onUpdate();
      onClose();
      toast.success(existingTask ? 'Task updated successfully' : 'Task created successfully');
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      {existingTask ? 'Edit Task' : 'Create New Task'}
                    </Dialog.Title>

                    <div className="mt-4">
                      {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                          <div className="flex">
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                          </div>
                        </div>
                      )}

                      <Tab.Group>
                        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
                          <Tab
                            className={({ selected }) =>
                              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                              ${selected 
                                ? 'bg-white text-blue-700 shadow'
                                : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                              }`
                            }
                          >
                            Details
                          </Tab>
                          {existingTask && (
                            <Tab
                              className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                                ${selected 
                                  ? 'bg-white text-blue-700 shadow'
                                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                                }`
                              }
                            >
                              Time Tracking
                            </Tab>
                          )}
                        </Tab.List>
                        <Tab.Panels>
                          <Tab.Panel>
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  id="title"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                  required
                                />
                              </div>

                              <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                  Description
                                </label>
                                <textarea
                                  id="description"
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                                  rows={3}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                />
                              </div>

                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Status
                                  </label>
                                  <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                  >
                                    {Object.values(TaskStatus).map((status) => (
                                      <option key={status} value={status}>
                                        {status.replace(/_/g, ' ')}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                    Priority
                                  </label>
                                  <select
                                    id="priority"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                  >
                                    {Object.values(TaskPriority).map((priority) => (
                                      <option key={priority} value={priority}>
                                        {priority}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                                    Due Date
                                  </label>
                                  <input
                                    type="date"
                                    id="dueDate"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                                    Project
                                  </label>
                                  <select
                                    id="project"
                                    value={projectId}
                                    onChange={(e) => setProjectId(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                  >
                                    <option value="">Select a project</option>
                                    {projects.map((project) => (
                                      <option key={project.id} value={project.id}>
                                        {project.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
                                    Assignee
                                  </label>
                                  <select
                                    id="assignee"
                                    value={assigneeId}
                                    onChange={(e) => setAssigneeId(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                  >
                                    <option value="">Select an assignee</option>
                                    {users.map((user) => (
                                      <option key={user.id} value={user.id}>
                                        {user.name || user.email}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Tags</label>
                                <div className="mt-2 space-y-2">
                                  {tags.map((tag) => (
                                    <label key={tag.id} className="inline-flex items-center mr-4">
                                      <input
                                        type="checkbox"
                                        checked={selectedTags.includes(tag.id)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedTags([...selectedTags, tag.id]);
                                          } else {
                                            setSelectedTags(selectedTags.filter(id => id !== tag.id));
                                          }
                                        }}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                      />
                                      <span
                                        className="ml-2 text-sm"
                                        style={{ color: tag.color }}
                                      >
                                        {tag.name}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                  type="submit"
                                  disabled={isLoading}
                                  className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isLoading ? 'Saving...' : existingTask ? 'Update Task' : 'Create Task'}
                                </button>
                                <button
                                  type="button"
                                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                  onClick={onClose}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </Tab.Panel>
                          {existingTask && (
                            <Tab.Panel>
                              <TimeTracker taskId={existingTask.id} taskTitle={existingTask.title} />
                            </Tab.Panel>
                          )}
                        </Tab.Panels>
                      </Tab.Group>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
