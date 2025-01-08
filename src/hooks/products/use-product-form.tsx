import { useState, useEffect } from 'react';
import { DateValue } from '@nextui-org/react';
import { CalendarDate, parseDate } from "@internationalized/date";
import { ProductDetails } from './use-product-details';
import ProductInstanceApi from '@/api/product-instance-api';


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
    const [ originalProduct, setOriginalProduct ] = useState<ProductFormValues | null>(null);

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
        if ((originalProduct && originalProduct.name !== formattedValues.name)|| !originalProduct) 
            formData.append('name', formattedValues.name);

        if ((originalProduct && originalProduct.price !== formattedValues.price.toString()) || !originalProduct) 
            formData.append('price', formattedValues.price.toString());

        if ((originalProduct && originalProduct.description !== formattedValues.description )|| !originalProduct)
            formData.append('description', formattedValues.description);

        if ((originalProduct && originalProduct.currency !== formattedValues.currency )|| !originalProduct)
            formData.append('currency', formattedValues.currency);

        if ((originalProduct && originalProduct.stock !== formattedValues.stock.toString()) || !originalProduct)
            formData.append('stock', formattedValues.stock.toString());

        if ((originalProduct && originalProduct.weigth !== formattedValues.weigth.toString()) || !originalProduct)
            formData.append('weigth', formattedValues.weight.toString());
        
        if ((originalProduct && originalProduct.measurement !== formattedValues.measurement) || !originalProduct)
            formData.append('measurement', formattedValues.measurement);

        if ((originalProduct && originalProduct.caducityDate.toString() !== formattedValues.caducityDate.toString()) || !originalProduct)
            formData.append('caducityDate', formattedValues.caducityDate.toString());

        // console.log('formData stock', formData.get('stock')? formData.get('stock') : 'no stock');

        // Agregar archivos al FormData
        if (formattedValues.images.length > 0)
            formattedValues.images.forEach((file: File) => {
                formData.append('images', file);
            });

        try {
            if (id) {
                console.log('formattedValues', formData);
                const api = ProductInstanceApi.getInstance();
                const response = await api.patch(`/update/${id}`, formData);
                console.log(response);
            } else {

                const api = ProductInstanceApi.getInstance();
                const response = await api.post('/create', formData);
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
            const api = ProductInstanceApi.getInstance();
            const response = await api.get<ProductDetails>(`/${id}`);
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
                weigth: response.data.weight.toString(),
                measurement: response.data.measurement,
            });
            setOriginalProduct({
                id: response.data.id,
                name: response.data.name,
                price: response.data.price.toString(),
                description: response.data.description,
                caducityDate: formatDateForInput(response.data.caducityDate),
                stock: response.data.stock.toString(),
                images: [], // Add an empty array or fetch the images if available
                imagesUrl: response.data.images,
                currency: response.data.currency,
                weigth: response.data.weight.toString(),
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
