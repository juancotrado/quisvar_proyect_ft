import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/types';
import { AppDispatch } from '..';
import { axiosInstance } from '../../services/axiosInstance';
// type State = Users | null;

const INITIAL_STATE: User = {
  id: 0,
  email: '',
  password: '',
  role: 'EMPLOYEE',
  profile: {
    id: 0,
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    userId: 0,
  },
};

const userSessionSlice = createSlice({
  name: 'userSession',
  initialState: INITIAL_STATE,
  reducers: {
    setUserSessionGlobal: (state, action: PayloadAction<User>) =>
      action.payload,
  },
});
export const { setUserSessionGlobal } = userSessionSlice.actions;
export default userSessionSlice.reducer;
export const getUserSession = () => (dispatch: AppDispatch) => {
  axiosInstance
    .get('/profile')
    .then(res => dispatch(setUserSessionGlobal(res.data)))
    .catch(() => {
      dispatch(setUserSessionGlobal(INITIAL_STATE));
    });
};
