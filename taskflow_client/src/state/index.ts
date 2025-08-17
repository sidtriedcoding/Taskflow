import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the API hooks
export { useGetProjectsQuery, useCreateProjectMutation } from './api';
