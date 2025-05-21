import axios, { AxiosInstance, AxiosResponse } from 'axios';

const axiosClients: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});


axiosClients.interceptors.request.use(
    function (config) {
        //    config sau
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosClients.interceptors.response.use(function (response: AxiosResponse) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
});
export default axiosClients;