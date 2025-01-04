import { cuponInstanceApi } from '@/api/cupon-instance-api';
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
            const response = await cuponInstanceApi.get<Cupon[]>('/all',{
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
        console.log('deletePromotion', id);
    }

    function handlePage(p: number): void {
        if(p > 0 && p != page){
            setPage(p);
        }
    }

    useEffect(() => {
        fetchCupons();
    }, [page]);

    return { cupons, page, isLoading, error, handlePage, deleteCupon };
};

export default useCupons;