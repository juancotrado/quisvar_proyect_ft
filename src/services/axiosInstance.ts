import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { SnackbarUtilities } from '../utils/SnackbarManager';
import { errorToken$, loader$ } from './sharingSubject';

export const URL = import.meta.env.VITE_URL_DEV;

const API_BASE_URL = `${URL}/api/v1`;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

let requestsCount = 0;

const showLoader = (noLoader: boolean = false) => {
  if (!noLoader) {
    if (requestsCount === 0) {
      loader$.setSubject = true;
    }
    requestsCount++;
  }
};

const hideLoader = (noLoader: boolean = false) => {
  if (!noLoader) {
    requestsCount--;
    if (requestsCount === 0) {
      loader$.setSubject = false;
    }
  }
};
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
    showLoader(req.headers?.noLoader);
    setAuthorizationHeader(req);
    return req;
  });
  axiosInstance.interceptors.response.use(
    res => {
      hideLoader(res.config.headers?.noLoader);
      return res;
    },
    async err => {
      if (err instanceof AxiosError) {
        const { response, config } = err;
        hideLoader(config?.headers?.noLoader);
        if (!response) {
          if (err.code !== 'ERR_CANCELED') SnackbarUtilities.error(err.message);
          return Promise.reject(err);
        }
        if (response.data?.error?.name === 'JsonWebTokenError') {
          localStorage.removeItem('token');
          localStorage.removeItem('arrChecked');
          errorToken$.setSubject = true;
          return;
        }
        let message = response.data?.message;
        if (response.data instanceof Blob) {
          const data = JSON.parse(await response.data.text());
          message = data.message;
        }
        SnackbarUtilities.error(message);
        return Promise.reject(err);
      }
    }
  );
};
