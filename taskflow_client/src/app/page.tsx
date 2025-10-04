"use client";

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
} from "@/state/api";
import React from "react";
import { useAppSelector } from "./hooks";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridSxStyles } from "@/lib/utils";

const taskColumns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 300,
    flex: 1,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">Title</span>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">Status</span>
    ),
    renderCell: (params) => {
      const statusColors = {
        'To Do': 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700',
        'Work In Progress': 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/20',
        'Completed': 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/20',
        'Under Review': 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/20',
      };
      const status = params.value as keyof typeof statusColors;
      return (
        <span className={`px-2 py-1 rounded-full text-sm ${statusColors[status] || statusColors['To Do']}`}>
          {status}
        </span>
      );
    }
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 150,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">Priority</span>
    ),
    renderCell: (params) => {
      const priorityColors = {
        'Urgent': 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/20',
        'High': 'text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/20',
        'Medium': 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/20',
        'Low': 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/20',
        'Backlog': 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700',
      };
      const priority = params.value as keyof typeof priorityColors;
      return (
        <span className={`px-2 py-1 rounded-full text-sm ${priorityColors[priority] || priorityColors['Medium']}`}>
          {priority}
        </span>
      );
    }
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 150,
    renderHeader: () => (
      <span className="font-semibold text-gray-600 dark:text-gray-300">Due Date</span>
    ),
    valueFormatter: (params: { value: string | null } | null) => {
      if (!params || !params.value) return '';
      return new Date(params.value).toLocaleDateString();
    },
  },
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const HomePage = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: parseInt("1") });
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery();
  const { data: teams, isLoading: isTeamsLoading } = useGetTeamsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (tasksLoading || isProjectsLoading || isUsersLoading || isTeamsLoading) return <div>Loading..</div>;
  if (tasksError || !tasks || !projects || !users || !teams) return <div>Error fetching data</div>;

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const chartColors = isDarkMode
    ? {
      bar: "#818CF8", // Indigo
      barGrid: "#374151", // Dark gray
      text: "#D1D5DB", // Light gray
      tooltip: {
        background: "#1F2937", // Dark background
        text: "#F3F4F6", // Light text
      },
    }
    : {
      bar: "#818CF8", // Indigo
      barGrid: "#E5E7EB", // Light gray
      text: "#6B7280", // Gray
      tooltip: {
        background: "#FFFFFF", // White background
        text: "#111827", // Dark text
      },
    };

  return (
    <div className="flex h-full w-full flex-col bg-gray-50 dark:bg-gray-900">
      {/* Team Header */}
      <div className="mb-6 flex items-center gap-4 border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-xl font-bold text-white">
          S
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sid's Team</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Private</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 pb-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Project Management Dashboard
        </h2>

        {/* Statistics Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{tasks.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Teams</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{teams.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Task Priority Distribution */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Task Priority Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chartColors.barGrid}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke={chartColors.text}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke={chartColors.text}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartColors.tooltip.background,
                    color: chartColors.tooltip.text,
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill={chartColors.bar}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Project Status */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Project Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="count"
                  data={projectStatus}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {projectStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartColors.tooltip.background,
                    color: chartColors.tooltip.text,
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tasks Table */}
          <div className="col-span-1 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 md:col-span-2">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Your Tasks
            </h3>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={tasks}
                columns={taskColumns}
                checkboxSelection
                loading={tasksLoading}
                getRowId={(row) => row.id}
                className="border-none data-grid-container"
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
        </div>
      </div>
    </div>
  );
};

export default HomePage;