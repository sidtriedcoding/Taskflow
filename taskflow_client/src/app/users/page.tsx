'use client';

import { useGetUsersQuery } from '@/state/api';
import React from 'react';
import { Filter, Download } from 'lucide-react';
import Image from 'next/image';

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();

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

      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
        {/* Header with Filters and Export */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
            <Filter size={16} />
            <span>FILTERS</span>
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
            <Download size={16} />
            <span>EXPORT</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Username</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Profile Picture</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Team ID</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.userId}
                  className="border-b border-gray-200 last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.userId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.username}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative h-8 w-8">
                      {user.profilePictureUrl ? (
                        <Image
                          src={`/PICS/${user.profilePictureUrl}`}
                          alt={user.username || 'User avatar'}
                          fill
                          className="rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=6366f1&color=ffffff&size=64`;
                          }}
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
                          {user.username?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.teamId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            1-{users.length} of {users.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-gray-200 p-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              disabled
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="rounded-lg border border-gray-200 p-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              disabled
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;