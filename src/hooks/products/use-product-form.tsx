import { useState, useEffect } from 'react';
import { DateValue } from '@nextui-org/react';
import { CalendarDate, parseDate } from "@internationalized/date";
import { ProductDetails } from './use-product-details';
import { productInstanceApi } from '@/api/product-instance-api';


const formatDateForInput = (dateString: string): DateValue => {
    const date = new Date(dateString);
    return parseDate(date.toISOString().split('T')[0]);
};

export interface ProductFormValues {
    id?: string;
    name: string;
    price: string;
    description: string;
    caducityDate: DateValue;
    stock: string;
    images: File[];
    imagesUrl?: string[];
    currency: string;
    weigth: string;
    measurement: string;
}

const useProductForm = (idProduct?: string) => {

    const [initialProduct, setInitialProduct] = useState<ProductFormValues>({
        name: "",
        price: "2.00",
        description: "",
        caducityDate: new CalendarDate(2025, 11, 6),
        stock: "1",
        images: [],
        currency: "usd",
        weigth: "1.00",
        measurement: "g",
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);


    const saveProduct = async (product: ProductFormValues, id?: string) => {
        setIsLoading(true);
        setError(null);
        setIsError(false);

        const formattedValues = {
            ...product,
            price: parseFloat(product.price),
            stock: parseInt(product.stock),
            weight: parseFloat(product.weigth),
            caducityDate: product.caducityDate.toString(),
            // images: values.images.map((file: File) => file.name)
        };


        const formData = new FormData();
        formData.append('name', formattedValues.name);
        formData.append('price', formattedValues.price.toString());
        formData.append('description', formattedValues.description);
        formData.append('currency', formattedValues.currency);

        formData.append('stock', formattedValues.stock.toString());
        formData.append('weigth', formattedValues.weight.toString());
        formData.append('caducityDate', formattedValues.caducityDate);
        formData.append('measurement', formattedValues.measurement);

        // Agregar archivos al FormData
        formattedValues.images.forEach((file: File) => {
            formData.append('images', file);
        });

        console.log('formData', formData);

        try {
            if (id) {
                console.log('update');
                return;
            } else {
                const response = await productInstanceApi.post('/create', formData);
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

    const _getProductToEdit = async (id: string) => {

        setIsLoading(true);
        setError(null);
        setIsError(false);

        try {
            const response = await productInstanceApi.get<ProductDetails>(``, {
                params: {
                    id: id,
                },
            });
            // console.log(response.data);
            setInitialProduct({
                id: response.data.id,
                name: response.data.name,
                price: response.data.price.toString(),
                description: response.data.description,
                caducityDate: formatDateForInput(response.data.caducityDate),
                stock: response.data.stock.toString(),
                images: [], // Add an empty array or fetch the images if available
                imagesUrl: response.data.images,
                currency: response.data.currency,
                weigth: response.data.weigth.toString(),
                measurement: response.data.measurement,
            });
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
        if (idProduct) {
            _getProductToEdit(idProduct);
        }

    }, []);


    return { initialProduct, isFetching: isLoading, errorSaving: error, isErrorSaving: isError, saveProductApi: saveProduct };
}; 

export default useProductForm;
