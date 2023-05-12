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
        console.log('err en axios sin respose:', err.message);
        return;
      }
      // console.log('err en axios con response:', err.response);
      console.log('err en axios con response:');
      return Promise.reject(err);
    }
  );
};

export default axiosInstance;
