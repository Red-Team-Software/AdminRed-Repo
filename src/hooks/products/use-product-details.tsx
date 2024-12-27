import { useState, useEffect } from 'react';
import axios from 'axios';


const apiUrl = import.meta.env.VITE_APIURL;

const axiosInstance = axios.create({
    baseURL: apiUrl,
    timeout: 1000,
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

export interface ProductDetails {
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
}

const useProductDetails = (idProduct: string) => {
    const [product, setProduct] = useState<ProductDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get<ProductDetails>('/product', {
                params: {
                    id: idProduct,
                },
            }
            );
            setProduct(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            fetchProduct();
        } else {
            setError('No token found');
        }
    }, []);


    return { product, isLoading, error };
};

export default useProductDetails;