import axios from 'axios';



const apiUrl = import.meta.env.VITE_APIURL;

export const cuponInstanceApi = axios.create({
    baseURL: apiUrl + '/cupon',
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
});