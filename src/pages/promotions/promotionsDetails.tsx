import { ListboxWrapper } from "@/components/listbox-wrapper";
import { subtitle, title } from "@/components/primitives";
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
            <ModalHeader className={`${title({ size: "sm" })} text-center`}>Promotion Details</ModalHeader>

                <ModalBody>
                    {isLoading ? (
                        <Spinner size="lg" color="warning" label="Loading..." />
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : promotion ? (
                        <div>
                            <h1 className={`${title({size:"md", color:"yellow"})} uppercase flex justify-center p-2`}>{promotion.name}</h1>

                            <h2 className={subtitle()}>Description:</h2>
                            <p>{promotion.description}</p>
                            
                            <div className="mt-4 flex gap-4 items-end">
                                <h2 className="text-lg lg:text-xl text-default-600 block">Porcentaje:</h2>
                                <p className={title({size:"sm", color:"yellow"})}>{promotion.discount * 100} %</p>
                            </div>

                            <h2 className={subtitle()}>Products:</h2>
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

                            <h2 className={subtitle()}>Bundles:</h2>
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

                            <h2 className={subtitle()}>Categories:</h2>
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
                    <Button color="default" variant="flat" onClick={onOpen}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal >,
        container
    );
}