import { useState, useEffect } from 'react';
import axios from 'axios';


const apiUrl = import.meta.env.VITE_APIURL;


export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    currency: string;
}

const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get<Product[]>(apiUrl + '/product/all', {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                params: {
                    page,
                    perPage: 10,
                },
            }
            );
            let products: Product[] = []
            products = response.data.map(e => e)
            setProducts(products);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            fetchProducts();
        } else {
            setError('No token found');
        }
    }, [page]);

    function handlePage(p: number): void {
        if(p > 0 && p != page){
            setPage(p);
        }
    }

    return { products, isLoading, error, page, handlePage };
};

export default useProducts;