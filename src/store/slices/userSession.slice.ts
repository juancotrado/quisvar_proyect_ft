import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Users } from '../../types/types';
import { AppDispatch } from '..';
import { axiosInstance } from '../../services/axiosInstance';
// type State = Users | null;

const INITIAL_STATE: Users = {
  id: 0,
  email: '',
  password: '',
  profile: {
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
    setUserSessionGlobal: (state, action: PayloadAction<Users>) =>
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
