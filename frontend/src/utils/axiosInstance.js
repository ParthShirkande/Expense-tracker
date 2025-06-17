import axios from 'axios';
import {BASE_URL} from './apiPath'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

//request interceptor to add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access, e.g., redirect to login
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        else if (error.response && error.response.status === 403) {
            // Handle forbidden access
            alert('You do not have permission to perform this action.');
        } else if (error.response && error.response.status === 404) {
            // Handle not found
            alert('The requested resource was not found.');
        } else if (error.response && error.response.status >= 500) {
            // Handle server errors
            alert('An unexpected error occurred. Please try again later.');
        } else {
            // Handle other errors
            alert('An error occurred. Please try again.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;