import axios from 'axios';
import { SnackbarUtilities } from '../utils/SnackbarManager';

const axiosInstance = (cb: (value: boolean) => void) => {
  axios.interceptors.request.use(
    req => {
      cb(true);
      return req;
    },
    err => {
      cb(false);

      return Promise.reject(err);
    }
  );

  axios.interceptors.response.use(
    res => {
      cb(false);
      return res;
    },
    err => {
      cb(false);
      if (!err.response) {
        SnackbarUtilities.error(err.message);
        return Promise.reject(err);
      }
      SnackbarUtilities.error(err.response.data.message);
      return Promise.reject(err);
    }
  );
};

export default axiosInstance;
