import { useState, useEffect } from 'react';
import { Item } from '@/types';
import BundleInstanceApi from '@/api/bundle-instance-api';


interface IPromotions {
    id: string;
    name: string;
    discount: number;
}

export interface BundleDetails {
    id?: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    currency: string;
    measurement: string;
    weight: number;
    stock: number;
    caducityDate: string;
    category: [];
    discount: IPromotions[];
    products: Item[];
}

const useBundleDetails = (idBundle: string) => {
    const [bundle, setBundle] = useState<BundleDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBundle = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const bundleInstanceApi = BundleInstanceApi.getInstance();
            const response = await bundleInstanceApi.get<BundleDetails>(`/${idBundle}`);
            setBundle(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            fetchBundle();
        } else {
            setError('No token found');
        }
    }, []);


    return { bundle, isLoading, error };
};

export default useBundleDetails;