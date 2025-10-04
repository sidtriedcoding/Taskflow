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
    resizable: true,
    renderHeader: () => (
      <span className="font-semibold text-gray-800 dark:text-gray-100">
        Title
      </span>
    ),
    renderCell: (params) => (
      <div className="font-medium text-gray-900 dark:text-gray-100" title={params.value}>
        {params.value}
      </div>
    ),
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 300,
    flex: 1.5,
    resizable: true,
    renderHeader: () => (
      <span className="font-semibold text-gray-800 dark:text-gray-100">
        Description
      </span>
    ),
    renderCell: (params) => (
      <div className="truncate text-gray-700 dark:text-gray-200" title={params.value}>
        {params.value || '-'}
      </div>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 160,
    resizable: true,
    renderHeader: () => (
      <span className="font-semibold text-gray-800 dark:text-gray-100">
        Status
      </span>
    ),
    renderCell: (params) => {
      if (!params.value) return <span className="text-gray-500 dark:text-gray-300">-</span>;
      const statusColors = {
        'To Do':
          'bg-blue-100 text-blue-800 dark:bg-blue-500 dark:text-white',
        'Work In Progress':
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-500 dark:text-white',
        Completed:
          'bg-green-100 text-green-800 dark:bg-green-500 dark:text-white',
        'Under Review':
          'bg-orange-100 text-orange-800 dark:bg-orange-500 dark:text-white',
      };
      const status = params.value as keyof typeof statusColors;
      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[status] || statusColors['To Do']}`}
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
    resizable: true,
    renderHeader: () => (
      <span className="font-semibold text-gray-800 dark:text-gray-100">
        Priority
      </span>
    ),
    renderCell: (params) => {
      if (!params.value) return <span className="text-gray-500 dark:text-gray-300">-</span>;
      const priorityColors = {
        Urgent: 'bg-red-100 text-red-800 dark:bg-red-500 dark:text-white',
        High: 'bg-orange-100 text-orange-800 dark:bg-orange-500 dark:text-white',
        Medium:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-500 dark:text-white',
        Low: 'bg-blue-100 text-blue-800 dark:bg-blue-500 dark:text-white',
        Backlog:
          'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-white',
      };
      const priority = params.value as keyof typeof priorityColors;
      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${priorityColors[priority] || priorityColors['Medium']}`}
        >
          {priority}
        </span>
      );
    },
  },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 180,
    resizable: true,
    renderHeader: () => (
      <span className="font-semibold text-gray-800 dark:text-gray-100">
        Tags
      </span>
    ),
    renderCell: (params) => {
      if (!params.value) return <span className="text-gray-500 dark:text-gray-300">-</span>;
      const tags = params.value.split(',').filter((tag: string) => tag.trim());
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-600 dark:text-white"
            >
              {tag.trim()}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="text-xs text-gray-600 dark:text-gray-300">+{tags.length - 2}</span>
          )}
        </div>
      );
    },
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 130,
    resizable: true,
    renderHeader: () => (
      <span className="font-semibold text-gray-800 dark:text-gray-100">
        Start Date
      </span>
    ),
    renderCell: (params) => (
      <span className="text-gray-700 dark:text-gray-200">
        {params.value ? new Date(params.value).toLocaleDateString() : '-'}
      </span>
    ),
  },
  {
    field: 'dueDate',
    headerName: 'Due Date',
    width: 130,
    resizable: true,
    renderHeader: () => (
      <span className="font-semibold text-gray-800 dark:text-gray-100">
        Due Date
      </span>
    ),
    renderCell: (params) => (
      <span className="text-gray-700 dark:text-gray-200">
        {params.value ? new Date(params.value).toLocaleDateString() : '-'}
      </span>
    ),
  },
  {
    field: 'author',
    headerName: 'Author',
    width: 150,
    resizable: true,
    renderHeader: () => (
      <span className="font-semibold text-gray-800 dark:text-gray-100">
        Author
      </span>
    ),
    renderCell: (params) => (
      <div className="font-medium text-gray-800 dark:text-gray-100">
        {params.value?.username || 'Unknown'}
      </div>
    ),
  },
  {
    field: 'assignee',
    headerName: 'Assignee',
    width: 150,
    resizable: true,
    renderHeader: () => (
      <span className="font-semibold text-gray-800 dark:text-gray-100">
        Assignee
      </span>
    ),
    renderCell: (params) => (
      <div className="font-medium text-gray-800 dark:text-gray-100">
        {params.value?.username || '-'}
      </div>
    ),
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
        <div className="flex-1 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-dark-secondary">
          <DataGrid
            rows={filteredTasks}
            columns={columns}
            checkboxSelection
            getRowId={(row) => row.id}
            getRowHeight={() => 'auto'}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            className="border-none"
            sx={{
              ...dataGridSxStyles(isDarkMode),
              backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
              '& .MuiDataGrid-cell': {
                padding: '12px 8px',
                display: 'flex',
                alignItems: 'center',
                color: isDarkMode ? '#f3f4f6' : '#111827',
                borderBottom: isDarkMode
                  ? '1px solid #374151'
                  : '1px solid #e5e7eb',
                borderRight: isDarkMode
                  ? '1px solid #374151'
                  : '1px solid #e5e7eb',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
                borderBottom: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
              },
              '& .MuiDataGrid-columnHeader': {
                color: isDarkMode ? '#f3f4f6' : '#111827',
                borderRight: isDarkMode
                  ? '1px solid #374151'
                  : '1px solid #e5e7eb',
              },
              '& .MuiDataGrid-row': {
                backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                borderBottom: isDarkMode
                  ? '1px solid #374151'
                  : '1px solid #e5e7eb',
                '&:nth-of-type(even)': {
                  backgroundColor: isDarkMode ? '#1f1f1f' : '#f9fafb',
                },
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: isDarkMode ? '#262626 !important' : '#f3f4f6 !important',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
                borderTop: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                color: isDarkMode ? '#f3f4f6' : '#111827',
              },
              '& .MuiTablePagination-root': {
                color: isDarkMode ? '#f3f4f6' : '#111827',
              },
              '& .MuiTablePagination-selectIcon': {
                color: isDarkMode ? '#f3f4f6' : '#111827',
              },
              '& .MuiTablePagination-actions button': {
                color: isDarkMode ? '#f3f4f6' : '#111827',
              },
              '& .MuiCheckbox-root': {
                color: isDarkMode ? '#d1d5db' : '#6b7280',
              },
              '& .MuiCheckbox-root.Mui-checked': {
                color: isDarkMode ? '#60a5fa' : '#2563eb',
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ReusablePriorityPage;
