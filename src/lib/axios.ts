import axios from 'axios';

// ----------------------------------------------------------------------

const HOST_API = process.env.NEXT_PUBLIC_HOST_API;

const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    'x-client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
  },
});

console.log('HOST_API: ', HOST_API);
console.log('process.env.NEXT_PUBLIC_CLIENT_ID: ', process.env.NEXT_PUBLIC_CLIENT_ID);

// set timeout to 30 seconds
axiosInstance.defaults.timeout = 30000;

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // If the error has a response, include the response data in the error object
      error.responseData = error.response.data;
    }

    // Always reject the promise with the modified error object
    return Promise.reject(error);
  }
);

export default axiosInstance;
