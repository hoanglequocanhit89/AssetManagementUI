import axios, { AxiosInstance, AxiosResponse } from "axios";

const axiosClients: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClients.interceptors.request.use(
  function (config) {
    // Add any custom logic before the request is sent
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClients.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default axiosClients;
