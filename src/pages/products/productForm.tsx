import useProductDetails from "@/hooks/products/use-product-details"
import { Modal, ModalBody, ModalContent, ModalHeader, Input, Button, Textarea, ModalFooter, DatePicker, DateValue, CalendarDate } from "@nextui-org/react";
import { Form, Formik } from "formik"
import { useState } from "react"
import ReactDOM from "react-dom"

interface ProductFormProps {
    id?: string;
    isOpen: boolean;
    onOpen: () => void;
}

interface ProductFormValues {
    id?: string;
    name: string;
    price: number;
    description: string;
    caducityDate: DateValue;
    stock: number;
    images: File[];
    currency: string;
    weigth: number;
    measurement: string;
}

function ProductForm({ id, isOpen, onOpen }: ProductFormProps) {

    const [initialProduct, setInitialProduct] = useState<ProductFormValues>({
        name: "",
        price: 0,
        description: "",
        caducityDate: new CalendarDate(2024, 1, 1),
        stock: 0,
        images: [],
        currency: "",
        weigth: 0,
        measurement: "",
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setInitialProduct((prevState) => ({
                ...prevState,
                images: filesArray,
            }));
        }
    };

    const handleDateChange = (date: DateValue) => {
        setInitialProduct((prevState) => ({
            ...prevState,
            caducityDate: date,
        }));
    };

    if (id) {
        const { product, isLoading, error } = useProductDetails(id);
        if (isLoading) {
            return <div>Loading...</div>
        }
        if (error) {
            return <div>Error Fetching product to Edit: {error}</div>
        }
        if (product) {
            // setInitialProduct(product)
        }
    }

    const container = document.getElementById('overlays') as HTMLElement;
    return ReactDOM.createPortal(

        <Modal isOpen={isOpen} scrollBehavior="inside" size="4xl" onClose={onOpen} >
            <ModalContent>
                <ModalHeader className="flex justify-center">Product Form</ModalHeader>
                <ModalBody>
                    <Formik
                        initialValues={initialProduct}
                        onSubmit={(values) => {
                            console.log(values)
                        }}
                    >
                        {({ values, handleChange, handleSubmit }) => (
                            <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <Input
                                    type="text"
                                    name="name"
                                    label="Name"
                                    placeholder="Enter product name"
                                    value={values.name}
                                    onChange={handleChange}
                                />
                                <Textarea
                                    name="description"
                                    label="Description"
                                    placeholder="Enter product description"
                                    value={values.description}
                                    onChange={handleChange}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        startContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">$</span>
                                            </div>
                                        }
                                        label="Price"
                                        placeholder="0.00"
                                        type="number"
                                    />
                                    <Input
                                        type="text"
                                        name="currency"
                                        label="Currency"
                                        placeholder="USD"
                                        value={values.currency}
                                        onChange={handleChange}
                                    />
                                    <DatePicker className="max-w-[284px]"
                                        name="caducityDate"
                                        label="Caducity Date"
                                        value={values.caducityDate}
                                        onChange={handleDateChange}
                                    />
                                    <Input
                                        type="number"
                                        name="stock"
                                        label="Stock"
                                        placeholder="0"
                                        //value={values.stock}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        type="number"
                                        name="weigth"
                                        label="Weigth"
                                        placeholder="0.00"
                                        //value={values.weigth}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        type="text"
                                        name="measurement"
                                        label="Measurement"
                                        placeholder="Kg"
                                        value={values.measurement}
                                        onChange={handleChange}
                                    />

                                </div>
                                <Input
                                    type="file"
                                    name="images"
                                    label="Images"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                <ModalFooter className="flex justify-center py-4">
                                    <Button size="lg" color="danger" onPress={onOpen}>Cancel</Button>
                                    <Button size="lg" color="success" type="submit" className="text-white">Submit</Button>
                                </ModalFooter>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>,
        container
    )
}

export default ProductForm