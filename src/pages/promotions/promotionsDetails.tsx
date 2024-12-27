import { ListboxWrapper } from "@/components/listbox-wrapper";
import usePromotionDetails from "@/hooks/promotions/use-promotions-details";
import { DetailsPageProps } from "@/types";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Spinner,
    Listbox,
    ListboxItem,
} from "@nextui-org/react";
import ReactDOM from "react-dom";


export default function ProductDetailsPage({ id, isOpen, onOpen }: DetailsPageProps) {

    const { promotion, isLoading, error } = usePromotionDetails(id);

    const container = document.getElementById('overlays') as HTMLElement;
    return ReactDOM.createPortal(

        <Modal isOpen={isOpen} scrollBehavior="inside" size="2xl" onClose={onOpen} >
            <ModalContent>
                <ModalHeader className="flex justify-center">Product Details</ModalHeader>
                <ModalBody>
                    {isLoading ? (
                        <Spinner size="lg" color="warning" label="Loading..." />
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : promotion ? (
                        <div>
                            <h1 className="uppercase text-center font-bold text-purple-600 text-3xl">{promotion.name}</h1>

                            <h2 className="mt-4 font-bold text-xl">Description:</h2>
                            <p>{promotion.description}</p>

                            <div className="mt-2 flex gap-4 items-end font-bold text-xl">
                                <h2>Porcentaje:</h2>
                                <p className="text-3xl text-purple-600">{promotion.discount * 100} %</p>
                            </div>

                            <h2 className="mt-4 font-bold text-xl">Products:</h2>
                            <ListboxWrapper>
                                <Listbox
                                    disallowEmptySelection
                                    aria-label="Products"
                                    variant="faded"
                                //onSelectionChange={setSelectedKeys}
                                >
                                    {promotion.products.map((item, index) => (
                                        <ListboxItem key={index}>{item.name}</ListboxItem>
                                    ))}
                                </Listbox>
                            </ListboxWrapper>

                            <h2 className="mt-4 font-bold text-xl">Bundles:</h2>
                            <ListboxWrapper>
                                <Listbox
                                    disallowEmptySelection
                                    aria-label="Combos"
                                    variant="faded"
                                //onSelectionChange={setSelectedKeys}
                                >
                                    {
                                        promotion.bundles.map((item, index) => (
                                            <ListboxItem key={index} >{item.name}</ListboxItem>
                                        ))
                                    }
                                </Listbox>
                            </ListboxWrapper>

                            <h2 className="mt-4 font-bold text-xl">Categories:</h2>
                            <ListboxWrapper>
                                <Listbox
                                    disallowEmptySelection
                                    aria-label="Categories"
                                    variant="faded"
                                //onSelectionChange={setSelectedKeys}
                                >
                                    {promotion.categories.map((item, index) => (
                                        <ListboxItem key={index} >{item.name}</ListboxItem>
                                    ))}
                                </Listbox>
                            </ListboxWrapper>


                        </div>
                    ) : (
                        <p>No product found</p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={onOpen}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal >,
        container
    );
}