import axios from 'axios';



const apiUrl = import.meta.env.VITE_APIURL;

export const promotionInstanceApi = axios.create({
    baseURL: apiUrl + '/promotion',
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
});