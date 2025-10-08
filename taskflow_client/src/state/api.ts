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
  team?: {
    id: number;
    teamname: string;
  };
}

export interface Team {
  id: number;
  teamname: string;
  productOwnerUserId?: number;
  productOwnerUsername?: string;
  userCount: number;
  users?: User[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'task_update' | 'project_update' | 'comment' | 'team_update';
  isRead: boolean;
  createdAt: string;
  userId: number;
  taskId?: number;
  projectId?: number;
  teamId?: number;
  task?: Task;
  project?: Project;
  team?: Team;
}

export interface Comment {
  id: number;
  text: string;
  taskId: number;
  userId: number;
  createdAt?: string;
  user?: User;
  task?: Task;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}


export interface Task {
  comments: Comment[];
  id: number;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;
  attachments?: Attachment[];
  assignee?: User;
  author?: User;
}

export interface SearchResults {
  projects?: Project[];
  tasks?: Task[];
  users?: User[];
  teams?: Team[];
}

interface CreateProjectArgs {
  teamname: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

interface CreateUserArgs {
  username: string;
  email: string;
  cognitoId: string;
  profilePictureUrl?: string;
  teamId?: number;
}

interface CreateTeamArgs {
  teamname: string;
  productOwnerUserId?: number;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api/proxy',
    prepareHeaders: (headers) => {
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
      return headers;
    },
  }),
  reducerPath: 'api',
  tagTypes: ['Projects', 'Tasks', 'Users', 'Teams', 'Notifications', 'Comments'],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => 'projects',
      providesTags: ['Projects'],
      transformResponse: (response: Project[]) => {
        return response;
      },
      transformErrorResponse: (response: { status: number; data: unknown }) => {
        return response;
      },
    }),

    getProject: build.query<Project, { id: string }>({
      query: ({ id }) => `projects/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'Projects', id }],
    }),

    createProject: build.mutation<Project, CreateProjectArgs>({
      query: (newProject) => ({
        url: 'projects',
        method: 'POST',
        body: newProject, // Pass the newProject object directly as the body
      }),

      invalidatesTags: ['Projects'],
    }),

    getTasks: build.query<Task[], { projectId?: number }>({
      query: ({ projectId }) => projectId ? `tasks?projectId=${projectId}` : 'tasks',
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
    updateTask: build.mutation<Task, { taskId: number; updates: Partial<Task> }>({
      query: ({ taskId, updates }) => ({
        url: `tasks/${taskId}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Tasks', id: taskId },
      ],
    }),
    deleteTask: build.mutation<void, { taskId: number }>({
      query: ({ taskId }) => ({
        url: `tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Tasks', id: taskId },
      ],
    }),
    duplicateTask: build.mutation<Task, { taskId: number }>({
      query: ({ taskId }) => ({
        url: `tasks/${taskId}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: ['Tasks'],
    }),
    getUsers: build.query<User[], void>({
      query: () => 'users',
      providesTags: ['Users'],
    }),
    getTeams: build.query<Team[], void>({
      query: () => 'teams',
      providesTags: ['Teams'],
    }),
    createUser: build.mutation<User, CreateUserArgs>({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['Users'],
    }),
    createTeam: build.mutation<Team, CreateTeamArgs>({
      query: (newTeam) => ({
        url: 'teams',
        method: 'POST',
        body: newTeam,
      }),
      invalidatesTags: ['Teams'],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
    getNotifications: build.query<Notification[], { userId?: number }>({
      query: ({ userId }) => userId ? `notifications?userId=${userId}` : 'notifications',
      providesTags: ['Notifications'],
    }),
    getUnreadCount: build.query<{ count: number }, { userId?: number }>({
      query: ({ userId }) => userId ? `notifications/unread-count?userId=${userId}` : 'notifications/unread-count',
      providesTags: ['Notifications'],
    }),
    markAsRead: build.mutation<Notification, { notificationId: number }>({
      query: ({ notificationId }) => ({
        url: `notifications/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
    markAllAsRead: build.mutation<void, { userId: number }>({
      query: ({ userId }) => ({
        url: 'notifications/mark-all-read',
        method: 'PATCH',
        body: { userId },
      }),
      invalidatesTags: ['Notifications'],
    }),
    deleteNotification: build.mutation<void, { notificationId: number }>({
      query: ({ notificationId }) => ({
        url: `notifications/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
    getComments: build.query<Comment[], { taskId?: number }>({
      query: ({ taskId }) => taskId ? `comments?taskId=${taskId}` : 'comments',
      providesTags: ['Comments'],
    }),
    createComment: build.mutation<Comment, { taskId: number; text: string; userId: number }>({
      query: (newComment) => ({
        url: 'comments',
        method: 'POST',
        body: newComment,
      }),
      invalidatesTags: ['Comments', 'Notifications'],
    }),
    deleteComment: build.mutation<void, { commentId: number }>({
      query: ({ commentId }) => ({
        url: `comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comments'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useDuplicateTaskMutation,
  useSearchQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useGetTeamsQuery,
  useCreateTeamMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = api;
