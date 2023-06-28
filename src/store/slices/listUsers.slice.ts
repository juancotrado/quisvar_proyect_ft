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

export const getListUsers = () => (dispatch: AppDispatch) => {
  axiosInstance
    .get('/users')
    .then(res => dispatch(setListUser(res.data)))
    .catch(() => dispatch(setListUser(initialState)));
};
