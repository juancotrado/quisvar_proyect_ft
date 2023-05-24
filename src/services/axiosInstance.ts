import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SnackbarUtilities } from '../utils/SnackbarManager';
import { loader$ } from './sharingSubject';

export const URL = ' http://localhost:8081';
const API_BASE_URL = `${URL}/api/v1`;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

const setAuthorizationHeader = (config: AxiosRequestConfig) => {
  const token: string | null = localStorage.getItem('token');
  if (token) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
};

export const axiosInterceptor = () => {
  axiosInstance.interceptors.request.use(req => {
    loader$.setSubject = true;
    setAuthorizationHeader(req);
    return req;
  });
  axiosInstance.interceptors.response.use(
    res => {
      loader$.setSubject = false;
      return res;
    },
    err => {
      loader$.setSubject = false;
      if (!err.response) {
        SnackbarUtilities.error(err.message);
        return Promise.reject(err);
      }
      SnackbarUtilities.error(err.response.data.message);
      return Promise.reject(err);
    }
  );
};
