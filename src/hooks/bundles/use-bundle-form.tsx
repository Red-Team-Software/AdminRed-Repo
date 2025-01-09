import { useState, useEffect } from 'react';
import { Item } from '@/types';
import { Product } from '../products/use-products';
import { BundleDetails } from './use-bundle-details';
import { DateValue } from '@nextui-org/react';
import { parseDate, CalendarDate } from '@internationalized/date';
import BundleInstanceApi from '@/api/bundle-instance-api';
import ProductInstanceApi from '@/api/product-instance-api';



const formatDateForInput = (dateString: string): DateValue => {
    const date = new Date(dateString);
    return parseDate(date.toISOString().split('T')[0]);
};

export interface BundleFormValues {
    id?: string;
    name: string;
    description: string;
    caducityDate: DateValue;
    stock: string;
    images: File[];
    price: string;
    currency: string;
    weight: string;
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
        weight: '1',
        measurement: "kg",
        stock: "1",
        products: [],
    });
    const [ originalBundle, setOriginalBundle ] = useState<BundleFormValues | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);
    const [itemsFetched, setItemsFetched] = useState<Item[]>([]);
    const [page, setPage] = useState<number>(1);


    const saveBundle = async (bundle: BundleFormValues, id?: string) => {
        setIsLoading(true);
        setError(null);
        setIsError(false);
        const formattedValues = {
            ...bundle,
            price: parseFloat(bundle.price),
            stock: parseInt(bundle.stock),
            weight: parseFloat(bundle.weight),
            caducityDate: bundle.caducityDate.toString(),
        };


        const formData = new FormData();

        if ((originalBundle && originalBundle.name !== formattedValues.name)|| !originalBundle) 
            formData.append('name', formattedValues.name);

        if ((originalBundle && originalBundle.price !== formattedValues.price.toString() )|| !originalBundle) 
            formData.append('price', formattedValues.price.toString());

        if ( (originalBundle && originalBundle.description !== formattedValues.description) || !originalBundle)
            formData.append('description', formattedValues.description);

        if ( (originalBundle && originalBundle.currency !== formattedValues.currency) || !originalBundle)
            formData.append('currency', formattedValues.currency);

        if ( (originalBundle && originalBundle.stock !== formattedValues.stock.toString()) || !originalBundle)
            formData.append('stock', formattedValues.stock.toString());

        if ( (originalBundle && originalBundle.weight !== formattedValues.weight.toString()) || !originalBundle)
            formData.append('weigth', formattedValues.weight.toString());
        
        if ( (originalBundle && originalBundle.measurement !== formattedValues.measurement) || !originalBundle)
            formData.append('measurement', formattedValues.measurement);

        if ( (originalBundle && originalBundle.caducityDate.toString() !== formattedValues.caducityDate.toString()) || !originalBundle)
            formData.append('caducityDate', formattedValues.caducityDate.toString());

        formattedValues.products.forEach((product) => {
            formData.append('productId', product.id);
        });

        // Agregar archivos al FormData
        if(formattedValues.images && formattedValues.images.length > 0) {
            formattedValues.images.forEach((file: File) => {
                formData.append('images', file);
            });
        }

        // console.log('imagenes a enviar: ', formData.getAll('images') ? formData.get('images') : 'no hay imagenes');

        try {
            if (id) {
                const bundleInstanceApi = BundleInstanceApi.getInstance();
                const response = await bundleInstanceApi.patch(`/update/${id}`, formData);
                console.log(response);
            } else {
                const bundleInstanceApi = BundleInstanceApi.getInstance();
                const response = await bundleInstanceApi.post('/create', formData);
                console.log(response);
            }
        } catch (err: any) {
            console.log(err);
            setIsError(true);
            setError('Error saving bundle: ' + err.response.data.message,);
        } finally {
            setIsLoading(false);
        }
    }


    const _getPromotionToEdit = async (id: string) => {

        setIsLoading(true);
        setError(null);
        setIsError(false);
        try {
            const bundleInstanceApi = BundleInstanceApi.getInstance();
            const response = await bundleInstanceApi.get<BundleDetails>(`/${id}`);
            setInitialBundle({
                id: response.data.id,
                name: response.data.name,
                caducityDate: formatDateForInput(response.data.caducityDate),
                description: response.data.description,
                price: response.data.price.toString(),
                currency: response.data.currency,
                images: [],
                weight: response.data.weight.toString(),
                measurement: response.data.measurement,
                stock: response.data.stock.toString(),
                products: response.data.products,
            });

            setOriginalBundle({
                id: response.data.id,
                name: response.data.name,
                caducityDate: formatDateForInput(response.data.caducityDate),
                description: response.data.description,
                price: response.data.price.toString(),
                currency: response.data.currency,
                images: [],
                weight: response.data.weight.toString(),
                measurement: response.data.measurement,
                stock: response.data.stock.toString(),
                products: response.data.products,
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
        if (p > 0 && p != page) {
            setPage(p);
            fetchItems();
        }
    }

    const fetchItems = async () => {

        setIsLoading(true);
        setError(null);
        setIsError(false);

        try {
            const productInstanceApi = ProductInstanceApi.getInstance();
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
        } catch (err: any) {
            console.error(err);
            setIsError(true);
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


return { initialBundle, isFetching: isLoading, errorSaving: error, isErrorSaving: isError, saveBundleApi: saveBundle, itemsFetched, handlePage, page };
};

export default useBundleForm;
