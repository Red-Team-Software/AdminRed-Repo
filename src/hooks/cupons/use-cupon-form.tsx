import { useState, useEffect } from 'react';
import CuponInstanceApi from '@/api/cupon-instance-api';
import { Cupon } from './use-cupons';

export interface CuponFormValues {
    id?: string;
    code: string;
    name: string;
    discount: string;
    state: string;
}

const useCuponForm = (idCupon?: string) => {

    const [initialCupon, setInitialCupon] = useState<CuponFormValues>({
        name: "",
        code: "",
        discount: "",
        state: "ACTIVE",
    });

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);


    const saveCupon = async (cupon: CuponFormValues, id?: string ) => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        const formData = {
            code: cupon.code,
            name: cupon.name,
            discount: parseInt(cupon.discount)/100,
            state: cupon.state === 'ACTIVE' ? 'avaleable' : 'unavaleable',
        };
        console.log('formData', formData);

        try {
            if (id) {
                console.log('update');
                return;
            } else {
                const cuponInstanceApi = CuponInstanceApi.getInstance();
                const response = await cuponInstanceApi.post('/create', formData);
                console.log(response);
            }
        } catch (err: any) {
            console.log(err);
            setIsError(true);
            setError('Error saving category: ' + err.response.data.message,);
        } finally {
            setIsLoading(false);
        }
    }


    const _getCuponToEdit = async (id: string) => {

        setIsLoading(true);
        setError(null);
        setIsError(false);
        try {
            const cuponInstanceApi = CuponInstanceApi.getInstance();
            const response = await cuponInstanceApi.get<Cupon>(`/${id}`);
            setInitialCupon({
                id: response.data.id,
                name: response.data.name,
                code: response.data.code,
                discount: response.data.discount.toString(),
                state: response.data.state ? 'ACTIVE' : 'INACTIVE',
            });
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setIsError(true);
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
        if (idCupon) {
            _getCuponToEdit(idCupon);
        }
    }, []);


    return { initialCupon, isFetching: isLoading, isErrorSaving: isError,errorSaving: error, saveCuponApi: saveCupon };
};

export default useCuponForm;