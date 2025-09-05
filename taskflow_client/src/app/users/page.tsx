'use client';

import { useGetUsersQuery, User } from '@/state/api';
import React from 'react';
import { useAppSelector } from '../hooks';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';
import Image from 'next/image';
import { dataGridSxStyles } from '@/lib/utils';

const CustomToolbar = () => (
  <GridToolbarContainer className="flex gap-2 p-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef<User>[] = [
  {
    field: 'userId',
    headerName: 'ID',
    width: 70,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">ID</span>
    ),
  },
  {
    field: 'username',
    headerName: 'Username',
    width: 200,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">Username</span>
    ),
  },
  {
    field: 'profilePictureUrl',
    headerName: 'Profile Picture',
    width: 120,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">Profile Picture</span>
    ),
    renderCell: (params) => {
      const imageUrl = `/PICS/${params.value}`;
      const placeholderUrl = `https://placehold.co/64x64/6366f1/ffffff?text=${params.row.username?.[0]?.toUpperCase() || '?'}`;

      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative h-10 w-10">
            <Image
              src={imageUrl}
              alt={params.row.username || 'User avatar'}
              fill
              className="rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = placeholderUrl;
              }}
            />
          </div>
        </div>
      );
    },
  },
  {
    field: 'teamId',
    headerName: 'Team ID',
    width: 100,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">Team ID</span>
    ),
  },
];

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-lg text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (isError || !users) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-lg text-red-500">Error fetching users</div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-gray-50 p-6 dark:bg-gray-900">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
      <div className="flex-1 rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.userId!}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
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
              backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)',
              borderBottom: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: isDarkMode ? '1px solid rgba(75, 85, 99, 0.2)' : '1px solid rgba(229, 231, 235, 0.5)',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.1)' : 'rgba(243, 244, 246, 0.5)',
            },
          }}
        />
      </div>
    </div>
  );
};

export default Users;
