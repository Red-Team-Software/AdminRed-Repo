import { title } from '@/components/primitives';
import useCuponForm, { CuponFormValues } from '@/hooks/cupons/use-cupon-form';
import { ModalFormProps } from '@/types';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@nextui-org/react';
import { Form, Formik, FormikErrors } from 'formik';
import ReactDOM from 'react-dom';

function CuponForm({ id, isOpen, onOpen }: ModalFormProps) {

    const { initialCupon, errorSaving, isFetching, isErrorSaving, saveCuponApi } = useCuponForm(id);

    const stateOption = ["ACTIVE", "INACTIVE"];

    const container = document.getElementById("overlays") as HTMLElement;
    return ReactDOM.createPortal(
        <Modal isOpen={isOpen} scrollBehavior="inside" size="4xl" onClose={onOpen}>
            <ModalContent>
                <ModalHeader className={`${title({ size: "sm" })} text-center`}>{id ? "Edit" : "Create"} Promotion Form</ModalHeader>
                <ModalBody>
                    <Formik
                        enableReinitialize={true}
                        initialValues={initialCupon}
                        validate={(values) => {

                            const errors: FormikErrors<CuponFormValues> = {};

                            if (!values.name || values.name.trim() === "" || values.name.length < 5) {
                                errors.name = "Name is required and must be at least 5 characters";
                            }

                            if (!values.code || values.code.trim() === "" || values.code.length < 7) {
                                errors.code = "Code is required and must be at least 7 characters";
                            }

                            if (!values.discount || parseInt(values.discount) < 1 || parseInt(values.discount) > 100) {
                                errors.discount = "Discount is required and must be between 1 and 100";
                            }

                            if (!values.state) {
                                errors.state = "State is required";
                            }
                            return errors;
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);
                            await saveCuponApi(values, id);
                            setSubmitting(false);
                            alert(`Cupon saved: ${errorSaving}`);
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

                                <Input
                                    isRequired
                                    type="text"
                                    name="code"
                                    label="code"
                                    placeholder="Enter cupon code"
                                    value={values.code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    validate={() => {
                                        if ( touched.code && errors.code) return errors.code;
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
                                    name="state"
                                    defaultSelectedKeys={["ACTIVE"]}
                                    label="State"
                                    placeholder="Is the promotion active?"
                                    value={values.state}
                                >
                                    {stateOption.map((option) => (
                                        <SelectItem key={option} value={option} onChange={handleChange} onBlur={handleBlur}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {errors.state && <div className="text-red-500 text-center">{errors.state}</div>}

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

export default CuponForm