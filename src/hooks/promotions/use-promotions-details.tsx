import { useState, useEffect } from 'react';
import { Item } from '@/types';
import { promotionInstanceApi } from '@/api/promotion-instance-api';



export interface IPromotionsDetails {
    id:             string;
    description:    string;
    name:           string;
    avaleableState: boolean;
    discount:       number;
    products:       Item[];
    bundles:        Item[];
    categories:     Item[];
}

const usePromotionDetails = (idPomotion: string) => {
    const [promotion, setPromotion] = useState<IPromotionsDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPromotion = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await promotionInstanceApi.get<IPromotionsDetails>('', {
                params: {
                    id: idPomotion,
                },
            }
            );
            console.log(response)
            setPromotion(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            fetchPromotion();
        } else {
            setError('No token found');
        }
    }, []);


    return { promotion, isLoading, error };
};

export default usePromotionDetails;