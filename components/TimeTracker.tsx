'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Task } from '@/types';

interface TimeEntry {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  description: string | null;
  task: {
    title: string;
    project?: {
      name: string;
    };
  };
}

interface TimeTrackerProps {
  taskId: string;
  taskTitle: string;
}

export function TimeTracker({ taskId, taskTitle }: TimeTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [description, setDescription] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Load existing time entries and check for in-progress entry
    fetchTimeEntries();
    checkForInProgressEntry();
  }, [taskId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && currentEntry) {
      interval = setInterval(() => {
        const startTime = new Date(currentEntry.startTime).getTime();
        const now = new Date().getTime();
        setElapsedTime(Math.floor((now - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, currentEntry]);

  const fetchTimeEntries = async () => {
    try {
      const response = await fetch(`/api/time-entries?taskId=${taskId}`);
      if (response.ok) {
        const data = await response.json();
        setTimeEntries(data);
      }
    } catch (error) {
      console.error('Failed to fetch time entries:', error);
    }
  };

  const checkForInProgressEntry = async () => {
    try {
      const response = await fetch(`/api/time-entries?taskId=${taskId}&status=in-progress`);
      if (response.ok) {
        const entries = await response.json();
        const inProgressEntry = entries.find((entry: TimeEntry) => !entry.endTime);
        if (inProgressEntry) {
          setCurrentEntry(inProgressEntry);
          setIsTracking(true);
          setDescription(inProgressEntry.description || '');
          // Calculate initial elapsed time
          const startTime = new Date(inProgressEntry.startTime).getTime();
          const now = new Date().getTime();
          setElapsedTime(Math.floor((now - startTime) / 1000));
        }
      }
    } catch (error) {
      console.error('Failed to check for in-progress entry:', error);
    }
  };

  const startTracking = async () => {
    try {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          description,
        }),
      });

      if (response.ok) {
        const entry = await response.json();
        setCurrentEntry(entry);
        setIsTracking(true);
        setElapsedTime(0);
      }
    } catch (error) {
      console.error('Failed to start time tracking:', error);
    }
  };

  const stopTracking = async () => {
    if (!currentEntry) return;

    try {
      const response = await fetch('/api/time-entries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentEntry.id,
          endTime: new Date().toISOString(),
          description,
        }),
      });

      if (response.ok) {
        setIsTracking(false);
        setCurrentEntry(null);
        setDescription('');
        fetchTimeEntries();
      }
    } catch (error) {
      console.error('Failed to stop time tracking:', error);
    }
  };

  const updateCurrentEntry = async () => {
    if (!currentEntry) return;

    try {
      const response = await fetch('/api/time-entries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentEntry.id,
          description,
        }),
      });

      if (response.ok) {
        const updatedEntry = await response.json();
        setCurrentEntry(updatedEntry);
        fetchTimeEntries();
      }
    } catch (error) {
      console.error('Failed to update time entry:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{taskTitle}</h3>
          <div className="space-x-2">
            {!isTracking ? (
              <button
                onClick={startTracking}
                className="btn btn-success"
                disabled={timeEntries.some((entry) => !entry.endTime)}
              >
                {timeEntries.some((entry) => !entry.endTime) ? 'Timer In Progress' : 'Start Timer'}
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={updateCurrentEntry}
                  className="btn btn-primary"
                >
                  Update
                </button>
                <button
                  onClick={stopTracking}
                  className="btn btn-danger"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
        </div>

        {isTracking && currentEntry && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                className="input"
                rows={2}
              />
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>Started: {format(new Date(currentEntry.startTime), 'HH:mm:ss')}</span>
                <span className="font-medium text-primary-600">
                  Elapsed: {formatDuration(elapsedTime)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Time Entries</h4>
          <div className="space-y-3">
            {timeEntries.map((entry) => (
              <div
                key={entry.id}
                className="card p-4 hover:shadow-card-hover transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      {entry.description || 'No description'}
                    </p>
                    <div className="text-xs text-gray-500">
                      {format(new Date(entry.startTime), 'MMM d, yyyy HH:mm:ss')}
                      {entry.endTime && (
                        <> - {format(new Date(entry.endTime), 'HH:mm:ss')}</>
                      )}
                    </div>
                  </div>
                  {entry.duration && (
                    <span className="text-sm font-medium text-primary-600">
                      {formatDuration(entry.duration)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
