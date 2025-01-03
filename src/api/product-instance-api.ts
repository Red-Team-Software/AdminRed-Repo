import axios from 'axios';


const apiUrl = import.meta.env.VITE_APIURL;

export const productInstanceApi = axios.create({
    baseURL: apiUrl + `/product`,
    // timeout: 1000,
    headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
});
