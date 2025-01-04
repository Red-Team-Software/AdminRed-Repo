import PromotionInstanceApi from '@/api/promotion-instance-api';
import { useEffect, useState } from 'react';

export interface Promotion {
    id: string;
    description: string;
    name: string;
    avaleableState: boolean;
    discount: number;
    products: string[];
    bundles: string[];
    categories: string[];
}

const usePromotions = () => {

    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPromotions = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const promotionInstanceApi = PromotionInstanceApi.getInstance();
            const response = await promotionInstanceApi.get<Promotion[]>('/all',{
                params: {
                    page,
                    perPage: 10,
                },
            });
            setPromotions(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    function deletePromotion(id: string): void {
        console.log('deletePromotion', id);
    }

    function handlePage(p: number): void {
        if(p > 0 && p != page){
            setPage(p);
        }
    }

    useEffect(() => {
        fetchPromotions();
    }, [page]);

    return { promotions, page, isLoading, error, handlePage, deletePromotion };
};

export default usePromotions;