import { useState, useEffect } from 'react';
import { bundleInstanceApi } from '@/api/bundle-instance-api';

export interface Bundle {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    currency: string;
}

const useBundles = () => {
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);

    const fetchBundles = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await bundleInstanceApi<Bundle[]>('/all', {
                params: {
                    page,
                    perPage: 10,
                },
            }
            );
            let bundles: Bundle[] = []
            bundles = response.data.map(e => e)
            setBundles(bundles);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBundle = async (id: string) => {
        console.log('deleteBundle', id);
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
            fetchBundles();
        } else {
            setError('No token found');
        }
    }, [page]);

    function handlePage(p: number): void {
        if(p > 0 && p != page){
            setPage(p);
        }
    }

    return { bundles, isLoading, error, page, handlePage, deleteBundle };
};

export default useBundles;