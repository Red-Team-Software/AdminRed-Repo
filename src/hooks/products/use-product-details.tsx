import { useState, useEffect } from 'react';
import axios from 'axios';


const apiUrl = import.meta.env.VITE_APIURL;

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
            const response = await axios.get<ProductDetails>(apiUrl + '/product', {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                params: {
                    id: idProduct,
                },
            }
            );
            setProduct(response.data);
            console.log(product);
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