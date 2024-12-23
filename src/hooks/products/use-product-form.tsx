import { useState, useEffect } from 'react';
import axios from 'axios';
import { DateValue } from '@nextui-org/react';
import { CalendarDate, parseDate } from "@internationalized/date";



const apiUrl = import.meta.env.VITE_APIURL;

export interface ProductFormValues {
    id?: string;
    name: string;
    price: string;
    description: string;
    caducityDate: DateValue;
    stock: string;
    images: File[];
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
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = async () => {
        setIsLoading(true);
        setError(null);

        
    };

    const saveProduct = async (id?: string) => {
        setIsLoading(true);
        setError(null);
    }
        
    

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            fetchProduct();
        } else {
            setError('No token found');
        }
    }, []);


    return { initialProduct, isFetching: isLoading, errorSaving: error, };
};

export default useProductForm;