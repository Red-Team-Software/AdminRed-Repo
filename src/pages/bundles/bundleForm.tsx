import ButtonsPagination from '@/components/buttons-pagination';
import { ListboxWrapper } from '@/components/listbox-wrapper';
import { title } from '@/components/primitives';
import useBundleForm, { BundleFormValues } from '@/hooks/bundles/use-bundle-form';
import { ModalFormProps } from '@/types'
import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import { Modal, ModalContent, ModalHeader, ModalBody, DateInput, ModalFooter, Input, Listbox, ListboxItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { Formik, FormikErrors, Form } from 'formik';
import ReactDOM from 'react-dom';

function BundleForm({ id, isOpen, onOpen }: ModalFormProps) {
    const { initialBundle, isFetching, errorSaving, saveBundleApi, itemsFetched, page, handlePage } = useBundleForm(id);

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
                <ModalHeader className={`${title({ size: "sm" })} text-center`}>{id ? "Edit" : "Create"} Bundle Form</ModalHeader>
                <ModalBody>
                    <Formik
                        enableReinitialize={true}
                        initialValues={initialBundle}
                        validate={(values) => {
                            const errors: FormikErrors<BundleFormValues> = {};
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

                            if (values.products.length < 2) {
                                errors.products = "Required at least 2 products";
                            }

                            return errors;
                        }}

                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);

                            console.log(values);
                            await saveBundleApi(values, id);

                            setSubmitting(false);
                            if (!errorSaving) {
                                onOpen();
                            }
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
                                    placeholder="Enter Bundle name"
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
                                    placeholder="Enter Bundle description"
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


                                <div className='flex justify-between items-start m-8'>
                                    <div className="w-1/2">
                                        <h2 className="mt-4 font-bold">Products Selected:</h2>
                                        <ListboxWrapper>
                                            <Listbox
                                                disallowEmptySelection
                                                aria-label="items"
                                                variant="faded"
                                            >
                                                {values.products.map((item, index) => (
                                                    <ListboxItem key={index} onDoubleClick={() => setFieldValue('products', values.products.filter((_, i) => i !== index))}>{item.name}</ListboxItem>
                                                ))}
                                            </Listbox>
                                        </ListboxWrapper>

                                        {errors.products && (
                                            <div className="text-red-500">{Array.isArray(errors.products) ? errors.products.join(', ') : errors.products}</div>
                                        )}
                                        <p className="text-sm text-gray-500 mt-4">Double click to remove item</p>
                                    </div>

                                    <div className="w-1/2">
                                        <Table removeWrapper aria-label="item list" >
                                            <TableHeader>
                                                <TableColumn>NAME</TableColumn>
                                                <TableColumn>ACTION</TableColumn>
                                            </TableHeader>
                                            {isFetching ? (
                                                <TableBody emptyContent={"loading..."}>{[]}</TableBody>
                                            ) : errorSaving ? (
                                                <TableBody emptyContent={`Error: ${errorSaving}`}>{[]}</TableBody>
                                            ) : itemsFetched && itemsFetched.length > 0 ? (
                                                <TableBody>
                                                    {itemsFetched.map((item) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>{item.name}</TableCell>
                                                            <TableCell className="flex gap-1 items-center">
                                                                <Button color="primary" size="sm" variant="flat"
                                                                    onPress={() => {
                                                                        if (values.products.find((p) => p.id === item.id)) return;
                                                                        setFieldValue('products', [...values.products, item])
                                                                    }}>Select
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            ) : <TableBody emptyContent={`No items to show`}>{[]}</TableBody>}
                                        </Table>
                                        <ButtonsPagination currentPage={page} isLastPage={itemsFetched.length < 7} handlePage={handlePage} />
                                    </div>
                                </div>

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

export default BundleForm