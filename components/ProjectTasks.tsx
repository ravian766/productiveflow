'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, Project } from '@/types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskModal from './TaskModal';
import TaskAnalytics from './TaskAnalytics';

interface ProjectTasksProps {
  project: Project;
}

function ProjectTasks({ project }: ProjectTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(project.tasks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [users, setUsers] = useState<Array<{ id: string; name: string | null; email: string }>>([]);
  const [tags, setTags] = useState<Array<{ id: string; name: string; color: string }>>([]);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, usersRes, tagsRes] = await Promise.all([
        fetch(`/api/tasks?projectId=${project.id}`),
        fetch('/api/users'),
        fetch('/api/tags'),
      ]);

      if (!tasksRes.ok || !usersRes.ok || !tagsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [tasksData, usersData, tagsData] = await Promise.all([
        tasksRes.json(),
        usersRes.json(),
        tagsRes.json(),
      ]);

      setTasks(tasksData);
      setUsers(usersData);
      setTags(tagsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [project.id]);

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    const updatedTasks = tasks.map(task =>
      task.id === draggableId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    try {
      const response = await fetch(`/api/tasks/${draggableId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
        setTasks(tasks);
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status');
      setTasks(tasks);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-red-100 text-red-800';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case TaskPriority.LOW:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueDateColor = (dueDate: Date | null | undefined) => {
    if (!dueDate) return '';
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-red-600 font-medium';
    if (diffDays <= 2) return 'text-orange-600';
    if (diffDays <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  const toggleTaskDescription = (taskId: string) => {
    setExpandedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Task
        </button>
      </div>

      <TaskAnalytics tasks={tasks} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(TaskStatus).map((status) => (
            <div key={status} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{status}</h3>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{task.title}</h4>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                                    task.priority
                                  )}`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                              {task.description && (
                                <div className="relative">
                                  <p
                                    className={`text-sm text-gray-600 mb-2 ${
                                      expandedTasks.includes(task.id)
                                        ? ''
                                        : 'line-clamp-2'
                                    }`}
                                  >
                                    {task.description}
                                  </p>
                                  {task.description.length > 100 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleTaskDescription(task.id);
                                      }}
                                      className="text-xs text-indigo-600 hover:text-indigo-800"
                                    >
                                      {expandedTasks.includes(task.id)
                                        ? 'Show less'
                                        : 'Show more'}
                                    </button>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center">
                                  <span>{task.assignee.name || task.assignee.email}</span>
                                </div>
                                {task.dueDate && (
                                  <span className={getDueDateColor(task.dueDate)}>
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {task.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {task.tags.map((tag) => (
                                    <span
                                      key={tag.id}
                                      className="px-2 py-1 rounded-full text-xs"
                                      style={{
                                        backgroundColor: tag.color + '20',
                                        color: tag.color,
                                      }}
                                    >
                                      {tag.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="mt-2 flex justify-end">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTask(task);
                                  }}
                                  className="text-xs text-indigo-600 hover:text-indigo-800"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(undefined);
        }}
        onUpdate={() => {
          setIsModalOpen(false);
          setSelectedTask(undefined);
          fetchData();
        }}
        task={selectedTask}
      />
    </div>
  );
}

export default ProjectTasks;
