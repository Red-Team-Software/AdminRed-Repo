import CuponInstanceApi from '@/api/cupon-instance-api';
import { useEffect, useState } from 'react';

export interface Cupon {
    id: string;
    code: string;
    discount: number;
    name: string;
    state: boolean;
}

const useCupons = () => {

    const [cupons, setCupons] = useState<Cupon[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCupons = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const cuponInstanceApi = CuponInstanceApi.getInstance();
            const response = await cuponInstanceApi.get<Cupon[]>('/many',{
                params: {
                    page,
                    perPage: 10,
                },
            });
            setCupons(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    function deleteCupon(id: string): void {
        console.log('delete cupon: ', id);
    }

    function handlePage(p: number): void {
        if(p > 0 && p != page){
            setPage(p);
        }
    }

    useEffect(() => {
        fetchCupons();
    }, [page]);

    return { cupons, page, isLoading, error, handlePage, deleteCupon, fetchCupons };
};

export default useCupons;