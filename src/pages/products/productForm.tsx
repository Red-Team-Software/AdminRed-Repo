import useProductForm from "@/hooks/products/use-product-form";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Input,
    Button,
    Textarea,
    ModalFooter,
    DateInput,
} from "@nextui-org/react";
import { Form, Formik, FormikErrors } from "formik";
import ReactDOM from "react-dom";
import { ProductFormValues } from "@/hooks/products/use-product-form";
import { ModalFormProps } from "@/types";
import { title } from "@/components/primitives";


function ProductForm({ id, isOpen, onOpen }: ModalFormProps) {
    const { initialProduct, isFetching, errorSaving, saveProductApi, isErrorSaving } = useProductForm(id);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const files = event.target.files;
        if (files) {
            setFieldValue("images", Array.from(files));
        }
    };

    const container = document.getElementById("overlays") as HTMLElement;
    return ReactDOM.createPortal(
        <Modal isOpen={isOpen} scrollBehavior="inside" size="4xl" onClose={onOpen}>
            <ModalContent>
                <ModalHeader className={`${title({ size: "sm" })} text-center`}>{id ? "Edit" : "Create"} Product Form</ModalHeader>
                <ModalBody>
                    <Formik
                        enableReinitialize={true}
                        initialValues={initialProduct}
                        validate={(values) => {
                            const errors: FormikErrors<ProductFormValues> = {};
                            if (
                                !values.name ||
                                values.name.trim() === "" ||
                                values.name.length < 3
                            ) {
                                errors.name = "Required and must be at least 3 characters";
                            }
                            if (
                                !values.description ||
                                values.description.trim() === "" ||
                                values.description.length < 8
                            ) {
                                errors.description =
                                    "Required and must be at least 8 characters";
                            }
                            if (!values.price || parseFloat(values.price) < 1) {
                                errors.price = "Required and must be greater than 1";
                            }

                            if (!values.currency || values.currency.trim() === "") {
                                errors.currency = "Required";
                            }
                            if (!values.stock || parseFloat(values.stock) < 1) {
                                errors.stock = "Required and must be greater than 1";
                            }

                            if (!values.weigth || parseFloat(values.weigth) < 1) {
                                errors.weigth = "Required and must be greater than 1";
                            }

                            if (!values.measurement) {
                                errors.measurement = "Required";
                            }

                            if (!values.images || values.images.length < 1) {
                                errors.images = "Required";
                            }

                            return errors;
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);

                            // console.log(values);
                            await saveProductApi(values, id);
                            setSubmitting(false);
                            if ( !isErrorSaving ) onOpen();

                        }}
                    >
                        {({
                            values,
                            handleChange,
                            handleSubmit,
                            handleBlur,
                            touched,
                            errors,
                            isSubmitting,
                            isValid,
                            setFieldValue,
                        }) => (
                            <Form onSubmit={handleSubmit} className="flex flex-col gap-3">

                                <Input
                                    type="text"
                                    name="name"
                                    label="Name"
                                    placeholder="Enter product name"
                                    value={values.name}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    isRequired
                                    validate={() => {
                                        if (touched.name && errors.name) return errors.name;
                                    }}
                                />

                                <Textarea
                                    isRequired
                                    name="description"
                                    label="Description"
                                    placeholder="Enter product description"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    validate={() => {
                                        if (errors.description && touched.description)
                                            return errors.description;
                                    }}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        isRequired
                                        startContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">$</span>
                                            </div>
                                        }
                                        type="number"
                                        name="price"
                                        label="Price"
                                        placeholder="1.00"
                                        value={values.price}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        validate={() => {
                                            if (errors.price && touched.price) return errors.price;
                                        }}
                                    />
                                    <Input
                                        isRequired
                                        type="text"
                                        name="currency"
                                        label="Currency"
                                        placeholder="USD"
                                        value={values.currency}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        validate={() => {
                                            if (errors.currency && touched.currency)
                                                return errors.currency;
                                        }}
                                    />
                                    <DateInput
                                        name="caducityDate"
                                        label="Caducity Date"
                                        value={values.caducityDate}
                                        onChange={(date) => setFieldValue("caducityDate", date)}
                                        onBlur={handleBlur}
                                    />
                                    {/* {touched.caducityDate && errors.caducityDate && <div className="error">{errors.caducityDate}</div>} */}

                                    <Input
                                        isRequired
                                        type="number"
                                        name="stock"
                                        label="Stock"
                                        placeholder="0"
                                        value={values.stock}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        validate={() => {
                                            if (errors.stock && touched.stock) return errors.stock;
                                        }}
                                    />

                                    <Input
                                        isRequired
                                        type="number"
                                        name="weigth"
                                        label="Weigth"
                                        placeholder="0.00"
                                        value={values.weigth}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        validate={() => {
                                            if (errors.weigth && touched.weigth) return errors.weigth;
                                        }}
                                    />
                                    <Input
                                        type="text"
                                        name="measurement"
                                        label="Measurement"
                                        placeholder="g"
                                        value={values.measurement}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        validate={() => {
                                            if (errors.measurement && touched.measurement)
                                                return errors.measurement;
                                        }}
                                    />
                                </div>
                                <Input
                                    isRequired
                                    type="file"
                                    name="images"
                                    label="Images"
                                    multiple
                                    onChange={(event) => handleFileChange(event, setFieldValue)}
                                    validate={() => {
                                        if (errors.images && touched.images)
                                            return errors.images.toString();
                                    }}
                                />
                                <ModalFooter className="flex justify-center py-4">
                                    {isSubmitting && (
                                        <div className="flex justify-center">
                                            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></span>
                                        </div>
                                    )}
                                    {errorSaving && (
                                        <div className="text-red-500 text-center">{errorSaving}</div>
                                    )}
                                    <Button size="lg" color="danger" onPress={onOpen}>
                                        Cancel
                                    </Button>
                                    <Button
                                        size="lg"
                                        color="success"
                                        type="submit"
                                        disabled={!isValid || isSubmitting || isFetching || errorSaving ? true : false || id ? true : false}
                                        className="text-white disabled:bg-slate-400"
                                    >
                                        Save
                                    </Button>
                                </ModalFooter>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>,
        container
    );
}

export default ProductForm;
