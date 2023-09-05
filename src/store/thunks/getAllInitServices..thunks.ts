import { AppDispatch } from '..';
import { axiosInstance } from '../../services/axiosInstance';
import { setListStage } from '../slices/listStages.slice';
import { setListUser } from '../slices/listUsers.slice';
import { setUserSessionGlobal } from '../slices/userSession.slice';

export const getAllServices = () => async (dispatch: AppDispatch) => {
  const profileResponse = await axiosInstance.get('/profile');
  const usersResponse = await axiosInstance.get('/users');
  const stagesResponse = await axiosInstance.get('/stages');
  dispatch(setUserSessionGlobal(profileResponse.data));
  dispatch(setListUser(usersResponse.data));
  dispatch(setListStage(stagesResponse.data));
};
