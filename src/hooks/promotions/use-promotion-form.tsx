import { useState, useEffect } from 'react';
import { Item } from '@/types';
import { IPromotionsDetails } from './use-promotions-details';
import { Product } from '../products/use-products';
import PromotionInstanceApi from '@/api/promotion-instance-api';
import ProductInstaceApi from '@/api/product-instance-api';
import BundleInstanceApi from '@/api/bundle-instance-api';



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
    const [ isError, setIsError ] = useState<boolean>(false);

    const [ error, setError ] = useState<string | null>(null);
    const [ itemType, setItemType ] = useState<Item>(ItemsTypeList[0]);
    const [ itemsFetched, setItemsFetched ] = useState<Item[]>([]);
    const [ page, setPage ] = useState<number>(1);


    const savePromotion = async (promotion: PromotionFormValues, id?: string) => {
        setIsLoading(true);
        setError(null);
        setIsError(false);

        const formattedValues: any = {
            name: promotion.name,
            description: promotion.description,
            state: promotion.avaleableState === 'YES' ? 'avaleable' : 'unabaleable',
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
                const promotionInstanceApi = PromotionInstanceApi.getInstance();
                const response = await promotionInstanceApi.post('/create', formattedValues);
                console.log(response);
            }
        } catch (err: any) {
            console.log(err);
            setIsError(true);
            setError('Error saving product: ' + err.response.data.message,);
        } finally {
            setIsLoading(false);
        }
    }


    const _getPromotionToEdit = async (id: string) => {

        setIsLoading(true);
        setError(null);
        setIsError(false);
        try {
            const promotionInstanceApi = PromotionInstanceApi.getInstance();
            const response = await promotionInstanceApi.get<IPromotionsDetails>(`/${id}`);
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
            setIsError(true);
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
        setIsError(false);
        try {
            if (!itemType) {
                return;
            }
            if (itemId === '1') {
                const productInstanceApi = ProductInstaceApi.getInstance();
                const response = await productInstanceApi.get<Product[]>('/many', {
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
                const bundleInstanceApi = BundleInstanceApi.getInstance();
                
                const { data } = await bundleInstanceApi.get<Item[]>('/many', {
                    params: {
                        page,
                        perPage: 5,
                    },
                });

                setItemsFetched(data);
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
            setIsError(true);
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


    return { initialPromotion, isFetching: isLoading, errorSaving: error, isErrorSaving: isError, savePromotionApi: savePromotion, itemType, handleSelectedType, ItemsTypeList, itemsFetched, handlePage, page };
};

export default usePromotionForm;
