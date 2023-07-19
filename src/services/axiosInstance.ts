import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SnackbarUtilities } from '../utils/SnackbarManager';
import { errorToken$, loader$ } from './sharingSubject';

export const URL = 'http://localhost:8081'; //dev
//export const URL = 'http://quisvar.sumak.digital'; //prod
// export const URL = 'http://143.198.168.251:8081'; //prod

export const URL_FILES = 'http://localhost:8081/static';
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
      const { response } = err;
      loader$.setSubject = false;
      if (!response) {
        SnackbarUtilities.error(err.message);
        return Promise.reject(err);
      }
      if (response.data.error.name === 'JsonWebTokenError') {
        localStorage.removeItem('token');
        errorToken$.setSubject = true;
        return;
      }
      SnackbarUtilities.error(response.data.message);
      return Promise.reject(err);
    }
  );
};
