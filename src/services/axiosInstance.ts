import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SnackbarUtilities } from '../utils/SnackbarManager';
import { Subject } from 'rxjs';

const API_BASE_URL = 'http://127.0.0.1:8081/api/v1';
export const isLoader$ = new Subject<boolean>();

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
    isLoader$.next(true);
    setAuthorizationHeader(req);
    return req;
  });
  axiosInstance.interceptors.response.use(
    res => {
      isLoader$.next(false);

      return res;
    },
    err => {
      if (!err.response) {
        isLoader$.next(false);
        SnackbarUtilities.error(err.message);
        return Promise.reject(err);
      }
      SnackbarUtilities.error(err.response.data.message);
      return Promise.reject(err);
    }
  );
};
