import { useState, useEffect } from 'react';
import axios from 'axios';
import { Item } from '@/types';


const apiUrl = import.meta.env.VITE_APIURL;

const axiosInstance = axios.create({
    baseURL: apiUrl,
    // timeout: 1000,
    headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
});

interface IPromotions {
    id: string;
    name: string;
    discount: number;
}

export interface BundleDetails {
    id: string;
    description: string;
    caducityDate: string;
    name: string;
    stock: number;
    images: string[];
    price: number;
    currency: string;
    weigth: number;
    measurement: string;
    categories: [];
    promotion: IPromotions[];
    products: Item[];

}

const useBundleDetails = (idBundle: string) => {
    const [bundle, setBundle] = useState<BundleDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBundle = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get<BundleDetails>('/bundle', {
                params: {
                    id: idBundle,
                },
            }
            );
            setBundle(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            fetchBundle();
        } else {
            setError('No token found');
        }
    }, []);


    return { bundle, isLoading, error };
};

export default useBundleDetails;