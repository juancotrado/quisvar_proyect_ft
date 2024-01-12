import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '../../types/types';
import { AppDispatch } from '..';
import { axiosInstance } from '../../services/axiosInstance';

type State = User[] | null;
const initialState = null as State;

const listUsersSlice = createSlice({
  name: 'list_users',
  initialState,
  reducers: {
    setListUser: (_state, action: PayloadAction<State>) => action.payload,
  },
});

export const { setListUser } = listUsersSlice.actions;
export default listUsersSlice.reducer;

export const getListUsers = () => async (dispatch: AppDispatch) => {
  try {
    const res = await axiosInstance.get('/users');
    dispatch(setListUser(res.data));
  } catch (e) {
    dispatch(setListUser(initialState));
  }
};
