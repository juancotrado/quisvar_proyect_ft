import { configureStore } from '@reduxjs/toolkit';
import userSession from './slices/userSession.slice';
import listUsers from './slices/listUsers.slice';
import modAuthProject from './slices/modAuthProject.slice';
import listStage from './slices/listStages.slice';
const store = configureStore({
  reducer: {
    userSession,
    listUsers,
    modAuthProject,
    listStage,
  },
});
// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;
