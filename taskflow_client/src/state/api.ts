import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Project {
  id: number;
  teamname: string; // Changed to match database schema
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
  comments: any;
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

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api', // Temporarily hardcoded for debugging
    prepareHeaders: (headers) => {
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
      console.log('🚀 API Request Headers:', headers);
      console.log('🌐 API Base URL:', 'http://localhost:8000/api');
      return headers;
    },
  }),
  reducerPath: 'api',
  tagTypes: ['Projects', 'Tasks'],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => {
        const url = `projects?t=${Date.now()}`;
        console.log('📡 Making API request to:', url);
        return url;
      },
      providesTags: ['Projects'],
      transformResponse: (response: any, meta, arg) => {
        console.log('✅ API Response received:', response);
        console.log('📊 Response meta:', meta);
        return response;
      },
      transformErrorResponse: (response: any, meta, arg) => {
        console.log('❌ API Error:', response);
        console.log('📊 Error meta:', meta);
        return response;
      },
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: 'projects',
        method: 'POST',
        body: {
          name: project.teamname, // Map teamname to name for API
          description: project.description,
          startDate: project.startDate,
          endDate: project.endDate,
        },
      }),
      invalidatesTags: [{ type: 'Projects', id: undefined }],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: 'Tasks', id }))
          : [{ type: 'Tasks' as const }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: 'tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Tasks'],
    }),
    //This is to update an individual task status at a time 
    updateTaskStatus: build.mutation<Task, { taskId: number; status: Status }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Tasks', id: taskId },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation
} = api;
