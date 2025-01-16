import CategoryInstanceApi from '@/api/category-instance-api';
import { useEffect, useState } from 'react';

export interface Category {
    id: string,
    name: string,
    imageUrl: string,
}

interface ICategoryResponse {
    id: string,
    name: string,
    image: string,
}

const useCategories = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const categoryInstanceApi = CategoryInstanceApi.getInstance();
            const response = await categoryInstanceApi.get<ICategoryResponse[]>('/many',{
                params: {
                    page,
                    perPage: 10,
                },
            });
            setCategories(response.data.map((category) => ({
                id: category.id,
                name: category.name,
                imageUrl: category.image,
            })));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    function deleteCategory(id: string): void {
        const categoryInstanceApi = CategoryInstanceApi.getInstance();
        categoryInstanceApi.delete(`/delete/${id}`)
        .then(() => {
            fetchCategories();
        }).catch((err) => {
            console.error(err);
            setError(err.message);
        });
    }

    function handlePage(p: number): void {
        if(p > 0 && p != page){
            setPage(p);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [page]);

    return { categories, page, isLoading, error, handlePage, deleteCategory, fetchCategories };
};

export default useCategories;