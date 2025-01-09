import axios, { AxiosInstance } from 'axios';

class BundleInstanceApi {
    private static instance: AxiosInstance;

    private constructor() {}

    public static getInstance(): AxiosInstance {
        if (!this.instance) {
            const apiUrl = import.meta.env.VITE_APIURL;
            this.instance = axios.create({
                baseURL: `${apiUrl}/bundle`,
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
        }
        return this.instance;
    }

}

export default BundleInstanceApi;