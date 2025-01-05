import ButtonsPagination from '@/components/buttons-pagination';
import { ListboxWrapper } from '@/components/listbox-wrapper';
import { title } from '@/components/primitives';
import usePromotionForm, { PromotionFormValues } from '@/hooks/promotions/use-promotion-form';
import { ModalFormProps } from '@/types';
import { Button, Input, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea } from '@nextui-org/react';
import { Form, Formik, FormikErrors } from 'formik';
import ReactDOM from 'react-dom';

function PromotionForm({ id, isOpen, onOpen }: ModalFormProps) {

    const { initialPromotion, errorSaving, isFetching, ItemsTypeList, itemsFetched, handleSelectedType, handlePage, page, itemType, savePromotionApi, isErrorSaving } = usePromotionForm(id);

    const availableOption = ["YES", "NO"];

    const container = document.getElementById("overlays") as HTMLElement;
    return ReactDOM.createPortal(
        <Modal isOpen={isOpen} scrollBehavior="inside" size="4xl" onClose={onOpen}>
            <ModalContent>
                <ModalHeader className={`${title({ size: "sm" })} text-center`}>{id ? "Edit" : "Create"} Promotion Form</ModalHeader>
                <ModalBody>
                    <Formik
                        enableReinitialize={true}
                        initialValues={initialPromotion}
                        validate={(values) => {

                            const errors: FormikErrors<PromotionFormValues> = {};

                            if (!values.name || values.name.trim() === "" || values.name.length < 5) {
                                errors.name = "Name is required and must be at least 5 characters";
                            }

                            if (!values.description || values.description.trim() === "" || values.description.length < 8) {
                                errors.description = "Description is required and must be at least 8 characters";
                            }

                            if (!values.discount || parseInt(values.discount) < 1 || parseInt(values.discount) > 100) {
                                errors.discount = "Discount is required and must be between 1 and 100";
                            }

                            if (!values.avaleableState) {
                                errors.avaleableState = "Is Available is required";
                            }

                            if (values.products.length === 0 && values.bundles.length === 0 ) {
                                errors.products = "At least one product, bundle or category is required";
                                errors.bundles = "At least one product, bundle or category is required";
                                // errors.categories = "At least one product, bundle or category is required";
                            }

                            return errors;
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);
                            await savePromotionApi(values, id);
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
                            setFieldValue,
                            isValid,
                        }) => (
                            <Form onSubmit={handleSubmit} className="flex flex-col gap-3">

                                <Input
                                    isRequired
                                    type="text"
                                    name="name"
                                    label="Name"
                                    placeholder="Enter promotion name"
                                    value={values.name}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    validate={() => {
                                        if ( touched.name && errors.name) return errors.name;                                        
                                    }}
                                />

                                <Textarea
                                    isRequired
                                    type="text"
                                    name="description"
                                    label="Description"
                                    placeholder="Enter promotion description"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    validate={() => {
                                        if ( touched.description && errors.description) return errors.description;
                                    }}
                                />

                                <Input
                                    isRequired
                                    type="number"
                                    name="discount"
                                    label="Discount"
                                    placeholder="15"
                                    value={values.discount}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    validate={() => {
                                        if (errors.discount) return errors.discount;
                                    }}
                                />

                                <Select
                                    isRequired
                                    name="avaleableState"
                                    defaultSelectedKeys={["YES"]}
                                    label="Is Available"
                                    placeholder="Yes or Not"
                                    value={values.avaleableState}
                                >
                                    {availableOption.map((option) => (
                                        <SelectItem key={option} value={option} onChange={handleChange} onBlur={handleBlur}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {errors.avaleableState && <div className="text-red-500 text-center">{errors.avaleableState}</div>}

                                <div className='flex justify-between items-start m-8'>
                                    <div className="w-1/2">
                                        <Select
                                            isRequired
                                            label="Select Items"
                                            placeholder="Select products, bundles or categories"
                                            // selectedKeys={ItemsTypeList[0].id}
                                            onChange={(e) => handleSelectedType(e.target.value)}
                                            className='w-2/3'
                                        >
                                            {ItemsTypeList.map((option) => (
                                                <SelectItem key={option.id} >
                                                    {option.name}
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        <h2 className="mt-4 font-bold">Products Selected:</h2>
                                        <ListboxWrapper>
                                            <Listbox
                                                disallowEmptySelection
                                                aria-label="items"
                                                variant="faded"
                                            //onSelectionChange={setSelectedKeys}
                                            >
                                                {values.products.map((item, index) => (
                                                    <ListboxItem key={index} onDoubleClick={() => setFieldValue('products', values.products.filter((_, i) => i !== index))}>{item.name}</ListboxItem>
                                                ))}
                                            </Listbox>
                                        </ListboxWrapper>

                                        <h2 className="mt-4 font-bold">Bundles Selected:</h2>
                                        <ListboxWrapper>
                                            <Listbox
                                                disallowEmptySelection
                                                aria-label="items"
                                                variant="faded"
                                            //onSelectionChange={setSelectedKeys}
                                            >
                                                {values.bundles.map((item, index) => (
                                                    <ListboxItem key={index} onDoubleClick={() => setFieldValue('bundles', values.products.filter((_, i) => i !== index))}>{item.name}</ListboxItem>
                                                ))}
                                            </Listbox>
                                        </ListboxWrapper>

                                        {/* <h2 className="mt-4 font-bold">Categories Selected:</h2>
                                        <ListboxWrapper>
                                            <Listbox
                                                disallowEmptySelection
                                                aria-label="items"
                                                variant="faded"
                                            //onSelectionChange={setSelectedKeys}
                                            >
                                                {values.categories.map((item, index) => (
                                                    <ListboxItem key={index}>{item.name}</ListboxItem>
                                                ))}
                                            </Listbox>
                                        </ListboxWrapper> */}

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
                                                                <Button color="primary" size="sm" variant="flat" onPress={() => {
                                                                    if (itemType.id=== '1') {
                                                                        if (values.products.find((p) => p.id === item.id)) return;
                                                                        setFieldValue('products', [...values.products, item]);
                                                                    }
                                                                    if (itemType.id=== '2') {
                                                                        if (values.products.find((p) => p.id === item.id)) return;
                                                                        setFieldValue('bundles', [...values.bundles, item]);
                                                                    }

                                                                }}>Select</Button>
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

export default PromotionForm