import { useState, useEffect } from 'react';
import axios from 'axios';
import { Item } from '@/types';
import { Product } from '../products/use-products';
import { BundleDetails } from './use-bundle-details';
import { DateValue } from '@nextui-org/react';
import { parseDate, CalendarDate } from '@internationalized/date';
import { m } from 'framer-motion';

const apiUrl = import.meta.env.VITE_APIURL;


const formatDateForInput = (dateString: string): DateValue => {
    const date = new Date(dateString);
    return parseDate(date.toISOString().split('T')[0]);
};

const axiosInstance = axios.create({
    baseURL: apiUrl + '/bundle',
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
});

const axiosInstanceItems = axios.create({
    baseURL: apiUrl + '/product',
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
});

export interface BundleFormValues {
    id?: string;
    description: string;
    caducityDate: DateValue;
    name: string;
    stock: string;
    images: File[];
    price: string;
    currency: string;
    weigth: string;
    measurement: string;
    products: Item[];
}

const useBundleForm = (idBundle?: string) => {

    const [initialBundle, setInitialBundle] = useState<BundleFormValues>({
        name: "",
        description: "",
        caducityDate: new CalendarDate(2026, 1, 1),
        price: "5.00",
        currency: "usd",
        images: [],
        weigth: '1',
        measurement: "kg",
        stock: "1",
        products: [],
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [itemsFetched, setItemsFetched] = useState<Item[]>([]);
    const [page, setPage] = useState<number>(1);


    const saveBundle = async (bundle: BundleFormValues, id?: string) => {
        setIsLoading(true);
        setError(null);

        const formattedValues = new FormData();
        formattedValues.append('name', bundle.name);
        formattedValues.append('description', bundle.description);
        formattedValues.append('caducityDate', bundle.caducityDate.toString());
        formattedValues.append('stock', bundle.stock);
        formattedValues.append('price', bundle.price);
        formattedValues.append('currency', bundle.currency.toLocaleLowerCase());
        formattedValues.append('weigth', bundle.weigth);
        formattedValues.append('measurement', bundle.measurement);
        bundle.products.forEach((product) => {
            formattedValues.append('productId', product.id);
        });

        bundle.images.forEach((image) => {
            formattedValues.append('images', image);
        });

        console.log('formated values',formattedValues);

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
            setError('Error saving bundle: ' + err.response.data.message,);
        } finally {
            setIsLoading(false);
        }
    }


    const _getPromotionToEdit = async (id: string) => {

        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get<BundleDetails>(``, {
                params: {
                    id: id,
                },
            });
            setInitialBundle({
                id: response.data.id,
                name: response.data.name,
                caducityDate: formatDateForInput(response.data.caducityDate),
                description: response.data.description,
                price: response.data.price.toString(),
                currency: response.data.currency,
                images: [],
                weigth: response.data.weigth.toString(),
                measurement: response.data.measurement,
                stock: response.data.stock.toString(),
                products: response.data.products,
            });
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    function handlePage(p: number): void {
        if (p > 0 && p != page) {
            setPage(p);
            fetchItems();
        }
    }

    const fetchItems = async () => {

        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosInstanceItems.get<Product[]>('/all', {
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
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
};

useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        setError('No token found');
        return;
    }
    fetchItems();
    if (idBundle) {
        _getPromotionToEdit(idBundle);
    }
}, []);


return { initialBundle, isFetching: isLoading, errorSaving: error, saveBundleApi: saveBundle, itemsFetched, handlePage, page };
};

export default useBundleForm;
