import { useState, useEffect } from 'react';
import axios from 'axios';
import { Item } from '@/types';
import { IPromotionsDetails } from './use-promotions-details';
import { Product } from '../products/use-products';

const apiUrl = import.meta.env.VITE_APIURL;

const axiosInstance = axios.create({
    baseURL: apiUrl + '/promotion',
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
});

const axiosInstanceItems = axios.create({
    baseURL: apiUrl,
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
});

export interface PromotionFormValues {
    id?: string;
    description: string;
    name: string;
    avaleableState: string;
    discount: string;
    products: Item[];
    bundles: Item[];
    // categories: Item[];
}

const usePromotionForm = (idPromotion?: string) => {

    const [initialPromotion, setInitialPromotion] = useState<PromotionFormValues>({
        name: "",
        description: "",
        avaleableState: "YES",
        discount: "5",
        products: [],
        bundles: [],
        // categories: [],
    });

    const ItemsTypeList: Item[] = [
        { id: '1', name: 'Products' },
        { id: '2', name: 'Bundles' },
        { id: '3', name: 'Categories' },
    ]

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ itemType, setItemType ] = useState<Item>(ItemsTypeList[0]);
    const [ itemsFetched, setItemsFetched ] = useState<Item[]>([]);
    const [ page, setPage ] = useState<number>(1);


    const savePromotion = async (promotion: PromotionFormValues, id?: string) => {
        setIsLoading(true);
        setError(null);

        const formattedValues: any = {
            name: promotion.name,
            description: promotion.description,
            avaleableState: promotion.avaleableState === 'YES' ? true : false,
            discount: parseFloat(promotion.discount) / 100,
        };

        if (promotion.products.length > 0) {
            formattedValues.products = promotion.products.map((item) => item.id);
        }

        if (promotion.bundles.length > 0) {
            formattedValues.bundles = promotion.bundles.map((item) => item.id);
        }

        console.log('formData', formattedValues);

        try {
            if (id) {
                console.log('update');
                return;
            } else {
                const response = await axiosInstance.post('/create', formattedValues);
                console.log(response);
            }
        } catch (err: any) {
            console.log(err);
            setError('Error saving product: ' + err.response.data.message,);
        } finally {
            setIsLoading(false);
        }
    }


    const _getPromotionToEdit = async (id: string) => {

        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get<IPromotionsDetails>(``, {
                params: {
                    id: id,
                },
            });
            setInitialPromotion({
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                avaleableState: response.data.avaleableState ? 'YES' : 'NO',
                discount: response.data.discount.toString(),
                products: response.data.products,
                bundles: response.data.bundles,
                // categories: response.data.categories,
            });
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    function handlePage(p: number): void {
        if(p > 0 && p != page){
            setPage(p);
            fetchItems(itemType.id);
        }
    }

    const fetchItems = async (itemId: string) => {

        setIsLoading(true);
        setError(null);

        try {
            if (!itemType) {
                return;
            }
            if (itemId === '1') {
                const response = await axiosInstanceItems.get<Product[]>('/product/all', {
                    params: {
                        page,
                        perPage: 7,
                    },
                });

                const products: Item[] = response.data.map((product) => {
                    return {
                        id: product.id,
                        name: product.name,
                    }
                });
                // console.log(products);
                setItemsFetched(products);
            }
            if (itemId === '2') {
            //     const response = await axiosInstanceItems.get<Item[]>('/bundle/all', {
            //         params: {
            //             page,
            //             perPage: 5,
            //         },
            //     });
                setItemsFetched([]);
            }
            if (itemType.id === '3') {
            //     const response = await axiosInstanceItems.get<Item[]>('/category/all', {
            //         params: {
            //             page,
            //             perPage: 5,
            //         },
            //     });
                setItemsFetched([]);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectedType = (itemId: string) => {
        const item = ItemsTypeList.find((item) => item.id === itemId);
        // console.log('Paso por aqui item:', item);
        if (item) {
            setItemType(item);
            setPage(1);
            fetchItems(itemId);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('No token found');
            return;
        }
        if (idPromotion) {
            _getPromotionToEdit(idPromotion);
        }
    }, []);


    return { initialPromotion, isFetching: isLoading, errorSaving: error, savePromotionApi: savePromotion, itemType, handleSelectedType, ItemsTypeList, itemsFetched, handlePage, page };
};

export default usePromotionForm;
