import { configureStore } from '@reduxjs/toolkit';
import userSession from './slices/userSession.slice';
import listUsers from './slices/listUsers.slice';
import modAuth from './slices/modAuth.slice';
const store = configureStore({
  reducer: {
    userSession,
    listUsers,
    modAuth,
  },
});
// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;
