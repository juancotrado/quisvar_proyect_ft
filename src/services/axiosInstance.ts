import axios from 'axios';

const axiosInstance = (cb: (value: boolean) => void) => {
  console.log('true');
  axios.interceptors.request.use(
    req => {
      // console.log('starting request', req);
      cb(true);
      return req;
    },
    err => {
      cb(true);

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
      return Promise.reject(err);
    }
  );
};

export default axiosInstance;
