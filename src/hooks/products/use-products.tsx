import { productInstanceApi } from '@/api/product-instance-api';
import { useState, useEffect } from 'react';

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
            const response = await productInstanceApi<Product[]>('/all', {
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

    const deleteProduct = async (id: string) => {
        console.log('deleteProduct', id);
        // setIsLoading(true);
        // setError(null);

        // try {
        //     await axiosInstance.delete(`/${id}`);
        //     fetchProducts();
        // } catch (err: any) {
        //     setError(err.message);
        // } finally {
        //     setIsLoading(false);
        // }
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

    return { products, isLoading, error, page, handlePage, deleteProduct };
};

export default useProducts;