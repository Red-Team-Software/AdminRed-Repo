import axios from "axios";


const apiUrl = import.meta.env.VITE_APIURL;

export const categoryInstanceApi = axios.create({
    baseURL: apiUrl + '/category',
    // timeout: 1000,
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
});