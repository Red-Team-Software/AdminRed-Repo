import axios from "axios";


const apiUrl = import.meta.env.VITE_APIURL;

export const bundleInstanceApi = axios.create({
    baseURL: apiUrl + '/bundle',
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
});