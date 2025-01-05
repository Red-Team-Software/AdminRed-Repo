import { useState, useEffect } from 'react';
import { Item } from '@/types';
import CategoryInstanceApi from '@/api/category-instance-api';


export interface CategoryDetails {
    id:       string;
    name:     string;
    image:    string;
    products: Item[];
    bundles:  Item[];
}

const useCategoryDetails = (idCategory: string) => {
    const [category, setCategory] = useState<CategoryDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategory = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const categoryInstanceApi = CategoryInstanceApi.getInstance();
            const response = await categoryInstanceApi.get<CategoryDetails>(`/${idCategory}`);
            // console.log(response)
            setCategory({
                id: response.data.id,
                name: response.data.name,
                image: response.data.image,
                products: response.data.products.map((product) => {
                    return {
                        id: product.id,
                        name: product.name,
                    };
                }),
                bundles: [],
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            fetchCategory();
        } else {
            setError('No token found');
        }
    }, []);


    return { category, isLoading, error };
};

export default useCategoryDetails;