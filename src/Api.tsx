// src/Api.ts
import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token'); // Optional: clear token on 401
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
// Api.interceptors.request.use((config: any) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default Api;
