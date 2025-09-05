import Header from '@/components/Header';
import { useAppSelector } from '@/app/hooks';
import { dataGridSxStyles } from '@/lib/utils';
import { useGetTasksQuery } from '@/state/api';
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

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Title', flex: 1, minWidth: 150 },
  { field: 'description', headerName: 'Description', flex: 1, minWidth: 200 },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => <StatusPill status={params.value} />,
  },
  { field: 'priority', headerName: 'Priority', width: 100 },
  { field: 'tags', headerName: 'Tags', width: 130 },
  { field: 'startDate', headerName: 'Start Date', width: 130 },
  { field: 'dueDate', headerName: 'Due Date', width: 130 },
  {
    field: 'author',
    headerName: 'Author',
    width: 150,
    // --- FIX START ---
    // The author object is the value, so we access its 'username' property.
    renderCell: (params) => params.value?.username || 'Unknown',
    // --- FIX END ---
  },
  {
    field: 'assignee',
    headerName: 'Assignee',
    width: 150,
    // --- FIX START ---
    // The assignee object is the value, so we access its 'username' property.
    renderCell: (params) => params.value?.username || 'Unassigned',
    // --- FIX END ---
  },
];

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div>Loading...</div>;
  if (error || !tasks) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
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

      <DataGrid
        rows={tasks || []}
        columns={columns}
        sx={dataGridSxStyles(isDarkMode)}
        className="!border-none"
      />
    </div>
  );
};

export default TableView;
