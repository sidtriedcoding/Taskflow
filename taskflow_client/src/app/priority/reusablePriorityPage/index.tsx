'use client';

import { useAppSelector } from '@/app/hooks';
import Header from '@/components/Header';
import ModalNewTask from '@/components/ModalNewTask';
import TaskCard from '@/components/TaskCard';
import { dataGridSxStyles } from '@/lib/utils';
import { Priority, Task, useGetTasksQuery } from '@/state/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';

type Props = {
  priority: Priority;
};

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 200,
    flex: 1,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">
        Title
      </span>
    ),
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 300,
    flex: 1,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">
        Description
      </span>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">
        Status
      </span>
    ),
    renderCell: (params) => {
      const statusColors = {
        'To Do':
          'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700',
        'Work In Progress':
          'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/20',
        Completed:
          'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/20',
        'Under Review':
          'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/20',
      };
      const status = params.value as keyof typeof statusColors;
      return (
        <span
          className={`rounded-full px-2 py-1 text-sm ${statusColors[status] || statusColors['To Do']}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 130,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">
        Priority
      </span>
    ),
    renderCell: (params) => {
      const priorityColors = {
        Urgent: 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/20',
        High: 'text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/20',
        Medium:
          'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/20',
        Low: 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/20',
        Backlog:
          'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700',
      };
      const priority = params.value as keyof typeof priorityColors;
      return (
        <span
          className={`rounded-full px-2 py-1 text-sm ${priorityColors[priority] || priorityColors['Medium']}`}
        >
          {priority}
        </span>
      );
    },
  },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 150,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">
        Tags
      </span>
    ),
    renderCell: (params) => {
      const tags = params.value?.split(',') || [];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 130,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">
        Start Date
      </span>
    ),
    valueFormatter: (params: { value: string | null }) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString();
    },
  },
  {
    field: 'dueDate',
    headerName: 'Due Date',
    width: 130,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">
        Due Date
      </span>
    ),
    valueFormatter: (params: { value: string | null }) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString();
    },
  },
  {
    field: 'author',
    headerName: 'Author',
    width: 150,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">
        Author
      </span>
    ),
    renderCell: (params) => params.value?.username || 'Unknown',
  },
  {
    field: 'assignee',
    headerName: 'Assignee',
    width: 150,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">
        Assignee
      </span>
    ),
    renderCell: (params) => params.value?.username || 'Unassigned',
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState('list');
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const {
    data: tasks,
    isLoading,
    isError: isTasksError,
  } = useGetTasksQuery({ projectId: undefined }); // Fetch all tasks from all projects

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTasks = tasks?.filter(
    (task: Task) => task.priority === priority
  );

  if (isTasksError || !tasks) return <div>Error fetching tasks</div>;

  return (
    <div className="flex h-full w-full flex-col bg-gray-50 p-6 dark:bg-gray-900">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {priority} Priority Tasks
        </h1>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={() => setIsModalNewTaskOpen(true)}
        >
          Add Task
        </button>
      </div>
      <div className="mb-6 flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm dark:bg-gray-800">
        <button
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${view === 'list'
            ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          onClick={() => setView('list')}
        >
          List View
        </button>
        <button
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${view === 'table'
            ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          onClick={() => setView('table')}
        >
          Table View
        </button>
      </div>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
          <div className="text-lg text-gray-500 dark:text-gray-400">
            Loading tasks...
          </div>
        </div>
      ) : !filteredTasks?.length ? (
        <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
          <div className="text-lg text-gray-500 dark:text-gray-400">
            No tasks found
          </div>
        </div>
      ) : view === 'list' ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="flex-1 rounded-lg bg-white shadow-sm dark:bg-gray-800">
          <DataGrid
            rows={filteredTasks}
            columns={columns}
            checkboxSelection
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            className="border-none"
            sx={{
              ...dataGridSxStyles(isDarkMode),
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: isDarkMode
                  ? 'rgba(55, 65, 81, 0.5)'
                  : 'rgba(243, 244, 246, 0.5)',
                borderBottom: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: isDarkMode
                  ? '1px solid rgba(75, 85, 99, 0.2)'
                  : '1px solid rgba(229, 231, 235, 0.5)',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: isDarkMode
                  ? 'rgba(55, 65, 81, 0.1)'
                  : 'rgba(243, 244, 246, 0.5)',
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ReusablePriorityPage;
