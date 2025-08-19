/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-expect-error - RTK Query types may not be fully available in dev environment
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Project {
  id: number;
  teamname: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export enum Priority {
  Urgent = 'Urgent',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  Backlog = 'Backlog',
}

export enum Status {
  ToDo = 'To Do',
  WorkInProgress = 'Work In Progress',
  UnderReview = 'Under Review',
  Completed = 'Completed',
}

export interface User {
  userId?: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  teamId?: number;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export interface Task {
  comments?: any;
  id: number;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string[];
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;
}

// Create API with explicit any types to avoid type errors
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
    prepareHeaders: (headers: any) => {
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
      return headers;
    },
  }),
  reducerPath: 'api',
  tagTypes: ['Projects', 'Tasks'],
  endpoints: (build: any) => ({
    getProjects: build.query({
      query: () => {
        const url = `projects?t=${Date.now()}`;
        return url;
      },
      providesTags: ['Projects'],
    }),
    createProject: build.mutation({
      query: (project: Partial<Project>) => ({
        url: 'projects',
        method: 'POST',
        body: {
          name: project.teamname,
          description: project.description,
          startDate: project.startDate,
          endDate: project.endDate,
        },
      }),
      invalidatesTags: ['Projects'],
    }),
    getTasks: build.query({
      query: ({ projectId }: { projectId: number }) => `tasks?projectId=${projectId}`,
      providesTags: (result: Task[] | undefined) =>
        result
          ? result.map(({ id }) => ({ type: 'Tasks' as const, id }))
          : [{ type: 'Tasks' as const }],
    }),
    getAllTasks: build.query({
      query: () => `tasks`,
      providesTags: (result: Task[] | undefined) =>
        result
          ? result.map(({ id }) => ({ type: 'Tasks' as const, id }))
          : [{ type: 'Tasks' as const }],
    }),
    createTask: build.mutation({
      query: (task: Partial<Task>) => ({
        url: 'tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Tasks'],
    }),
    updateTaskStatus: build.mutation({
      query: ({ taskId, status }: { taskId: number; status: Status }) => ({
        url: `tasks/${taskId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result: any, error: any, { taskId }: { taskId: number }) => [
        { type: 'Tasks' as const, id: taskId },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useGetAllTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
} = api;