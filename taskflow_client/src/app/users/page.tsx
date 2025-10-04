'use client';

import { useGetUsersQuery } from '@/state/api';
import React, { useState, useRef } from 'react';
import { Filter, Download, Plus, Upload, X, Check } from 'lucide-react';
import Image from 'next/image';
import ModalNewUser from '@/components/ModalNewUser';

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [isModalNewUserOpen, setIsModalNewUserOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    team: '',
    search: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get unique teams for filter dropdown
  const uniqueTeams = users ? [...new Set(users.map(user => user.team?.teamname).filter(Boolean))] : [];

  // Filter users based on current filters
  const filteredUsers = users ? users.filter(user => {
    const matchesTeam = !filters.team || user.team?.teamname === filters.team;
    const matchesSearch = !filters.search ||
      user.username.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());
    return matchesTeam && matchesSearch;
  }) : [];

  // Export users to CSV
  const handleExportCSV = () => {
    if (!filteredUsers.length) return;

    const headers = ['ID', 'Username', 'Email', 'Team', 'Profile Picture URL'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.userId,
        `"${user.username}"`,
        `"${user.email}"`,
        `"${user.team?.teamname || 'No team'}"`,
        `"${user.profilePictureUrl || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export users to JSON
  const handleExportJSON = () => {
    if (!filteredUsers.length) return;

    const jsonContent = JSON.stringify(filteredUsers, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file import
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let importedUsers;

        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          importedUsers = JSON.parse(content);
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
          importedUsers = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.replace(/"/g, '').trim());
            const user: any = {};
            headers.forEach((header, index) => {
              user[header.toLowerCase().replace(/\s+/g, '')] = values[index];
            });
            return user;
          });
        } else {
          alert('Please select a valid CSV or JSON file.');
          return;
        }

        console.log('Imported users:', importedUsers);
        alert(`Successfully imported ${importedUsers.length} users. Check console for details.`);
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ team: '', search: '' });
  };

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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleImport}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button
            onClick={() => setIsModalNewUserOpen(true)}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New User
          </button>
        </div>
      </div>

      <ModalNewUser
        isOpen={isModalNewUserOpen}
        onClose={() => setIsModalNewUserOpen(false)}
      />

      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
        {/* Header with Filters and Export */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${showFilters
                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <Filter size={16} />
              <span>FILTERS</span>
              {showFilters && <Check size={14} />}
            </button>
            {(filters.team || filters.search) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <X size={12} />
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Download size={16} />
              <span>EXPORT CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Download size={16} />
              <span>EXPORT JSON</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Users
                </label>
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Team
                </label>
                <select
                  value={filters.team}
                  onChange={(e) => setFilters({ ...filters, team: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Teams</option>
                  {uniqueTeams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Username</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Profile Picture</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Team</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
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
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.email}
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
                    {user.team?.teamname || 'No team'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            1-{filteredUsers.length} of {filteredUsers.length}
            {filteredUsers.length !== users.length && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                (filtered from {users.length} total)
              </span>
            )}
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

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Users;