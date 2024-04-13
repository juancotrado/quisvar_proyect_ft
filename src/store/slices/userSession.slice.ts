import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/types';
import { AppDispatch } from '..';
import { axiosInstance } from '../../services/axiosInstance';

export const INITIAL_STATE: User = {
  id: 0,
  email: '',
  password: '',
  profile: {
    id: 0,
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    userId: 0,
    degree: 'Practicante',
    description: '',
    job: {
      abrv: '',
      label: '',
      value: '',
      amount: 0,
    },
    department: '',
    province: '',
    district: '',
    addressRef: '',
    firstNameRef: '',
    lastNameRef: '',
    phoneRef: '',
    room: '',
    userPc: '',
    gender: '',
  },
  contract: null,
  cv: null,
  ruc: '',
  address: '',
  declaration: null,
  withdrawalDeclaration: null,
  role: null,
  roleId: 0,
};

const userSessionSlice = createSlice({
  name: 'userSession',
  initialState: INITIAL_STATE,
  reducers: {
    setUserSessionGlobal: (_state, action: PayloadAction<User>) =>
      action.payload,
    resetSession: () => INITIAL_STATE,
  },
});
export const { setUserSessionGlobal, resetSession } = userSessionSlice.actions;
export default userSessionSlice.reducer;
export const getUserSession = () => (dispatch: AppDispatch) => {
  axiosInstance
    .get('/profile')
    .then(res => dispatch(setUserSessionGlobal(res.data)))
    .catch(() => {
      dispatch(setUserSessionGlobal(INITIAL_STATE));
    });
};
