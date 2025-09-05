'use client';

import React from 'react';
import { useGetAllTasksQuery } from '@/src/state/api';
import ProjectHeader from '../projects/ProjectHeader';

const BacklogPage = () => {
  const [activeTab, setActiveTab] = React.useState('Board');
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = React.useState(false);

  const {
    data: allTasks = [],
    isLoading,
    error,
  } = useGetAllTasksQuery();

  // Filter tasks by backlog priority or tasks without priority
  const backlogTasks = allTasks.filter(
    (task) => task.priority === 'Backlog' || !task.priority
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading backlog tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">
          Error occurred while loading tasks
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProjectHeader
        name="Backlog"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="p-6">
        {backlogTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Backlog Tasks
            </h2>
            <p className="text-gray-500 dark:text-gray-500">
              There are currently no tasks in the backlog.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {backlogTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-dark-secondary rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'To Do' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        task.status === 'Work In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        task.status === 'Under Review' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                        task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {task.status || 'No Status'}
                      </span>
                      {task.dueDate && (
                        <span>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {task.projectId && (
                        <span>Project ID: {task.projectId}</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                    {task.priority || 'Backlog'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BacklogPage;
