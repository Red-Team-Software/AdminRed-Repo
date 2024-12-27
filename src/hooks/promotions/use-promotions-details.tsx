import { useState, useEffect } from 'react';
import axios from 'axios';


const apiUrl = import.meta.env.VITE_APIURL;

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

interface Item {
    id:   string;
    name: string;
}


const axiosInstance = axios.create({
    baseURL: apiUrl + '/promotion',
    timeout: 1000,
    headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
});


const usePromotionDetails = (idPomotion: string) => {
    const [promotion, setPromotion] = useState<IPromotionsDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPromotion = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get<IPromotionsDetails>('', {
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