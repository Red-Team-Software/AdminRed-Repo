import ProductInstanceApi from '@/api/product-instance-api';
import { useState, useEffect } from 'react';

interface IPromotions {
    id: string;
    name: string;
    discount: number;
}

export interface ProductDetails {
    id?: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    currency: string;
    weight: number;
    measurement: string;
    caducityDate: string;
    stock: number;
    discount: IPromotions[];
    categories: [];
}

const useProductDetails = (idProduct: string) => {
    const [product, setProduct] = useState<ProductDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const productInstanceApi = ProductInstanceApi.getInstance();
            const response = await productInstanceApi.get<ProductDetails>(`/${idProduct}`);
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