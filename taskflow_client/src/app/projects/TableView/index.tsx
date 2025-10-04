import Header from '@/components/Header';
import { useAppSelector } from '@/app/hooks';
import { dataGridSxStyles } from '@/lib/utils';
import { useGetTasksQuery, useUpdateTaskStatusMutation, Status } from '@/state/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const StatusPill = ({ status }: { status: string | null | undefined }) => {
  // --- FIX START ---
  // Handle null or undefined status gracefully to prevent crashes.
  if (!status) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
        Unknown
      </span>
    );
  }
  // --- FIX END ---

  let statusClasses = '';
  switch (status.toLowerCase()) {
    case 'completed':
      statusClasses =
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      break;
    case 'work in progress':
      statusClasses =
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      break;
    case 'to do':
      statusClasses =
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      break;
    default:
      statusClasses =
        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
  return (
    <span
      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusClasses}`}
    >
      {status}
    </span>
  );
};

const StatusDropdown = ({
  taskId,
  currentStatus,
  onStatusChange
}: {
  taskId: number;
  currentStatus: string | null | undefined;
  onStatusChange: (taskId: number, status: Status) => void;
}) => {
  const statuses: Status[] = [
    Status.ToDo,
    Status.WorkInProgress,
    Status.UnderReview,
    Status.Completed,
  ];

  return (
    <select
      value={currentStatus || ''}
      onChange={(e) => onStatusChange(taskId, e.target.value as Status)}
      className="rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      onClick={(e) => e.stopPropagation()}
    >
      {!currentStatus && <option value="">Select Status</option>}
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

const PriorityBadge = ({ priority }: { priority: string | null | undefined }) => {
  if (!priority) return <span className="text-gray-500 dark:text-gray-300">-</span>;

  const colors: Record<string, string> = {
    'Urgent': 'bg-red-100 text-red-800 dark:bg-red-500 dark:text-white',
    'High': 'bg-orange-100 text-orange-800 dark:bg-orange-500 dark:text-white',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500 dark:text-white',
    'Low': 'bg-blue-100 text-blue-800 dark:bg-blue-500 dark:text-white',
    'Backlog': 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-white',
  };

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[priority] || colors['Medium']}`}>
      {priority}
    </span>
  );
};

const columns = (
  onStatusChange: (taskId: number, status: Status) => void
): GridColDef[] => [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1.5,
      minWidth: 200,
      resizable: true,
      renderHeader: () => (
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          Title
        </span>
      ),
      renderCell: (params) => (
        <div className="font-medium text-gray-900 dark:text-white" title={params.value}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
      minWidth: 400,
      resizable: true,
      renderHeader: () => (
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          Description
        </span>
      ),
      renderCell: (params) => (
        <div className="text-gray-700 dark:text-gray-100 break-words leading-relaxed" title={params.value}>
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
      renderCell: (params) => (
        <StatusDropdown
          taskId={params.row.id}
          currentStatus={params.value}
          onStatusChange={onStatusChange}
        />
      ),
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
      renderCell: (params) => <PriorityBadge priority={params.value} />,
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
        <span className="text-gray-700 dark:text-gray-100">
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
        <span className="text-gray-700 dark:text-gray-100">
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
        <div className="font-medium text-gray-800 dark:text-white">
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
        <div className="font-medium text-gray-800 dark:text-white">
          {params.value?.username || '-'}
        </div>
      ),
    },
  ];

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const handleStatusChange = async (taskId: number, status: Status) => {
    try {
      await updateTaskStatus({ taskId, status }).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !tasks) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="flex h-[650px] w-full flex-col px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Table"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>

      <div className="mt-4 flex-1 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-dark-secondary">
        <DataGrid
          rows={tasks || []}
          columns={columns(handleStatusChange)}
          getRowHeight={() => 'auto'}
          sx={{
            ...dataGridSxStyles(isDarkMode),
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            width: '100%',
            height: '100%',
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
          className="border-none"
        />
      </div>
    </div>
  );
};

export default TableView;
