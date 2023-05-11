import axios from 'axios';

const AxiosInterceptors = () => {
  axios.interceptors.request.use(req => {
    console.log('starting request', req);
    return req;
  });
};

export default AxiosInterceptors;
