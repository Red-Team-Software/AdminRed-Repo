import { ListboxWrapper } from "@/components/listbox-wrapper";
import { subtitle, title } from "@/components/primitives";
import useCategoryDetails from "@/hooks/categories/use-category-details";
import { DetailsPageProps } from "@/types";
import {
    Image,
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


export default function CategoryDetailsPage({ id, isOpen, onOpen }: DetailsPageProps) {

    const { category, isLoading, error } = useCategoryDetails(id);

    const container = document.getElementById('overlays') as HTMLElement;
    return ReactDOM.createPortal(

        <Modal isOpen={isOpen} scrollBehavior="inside" size="2xl" onClose={onOpen} >
            <ModalContent>
            <ModalHeader className={`${title({ size: "sm" })} text-center`}>Category Details</ModalHeader>

                <ModalBody>
                    {isLoading ? (
                        <Spinner size="lg" color="warning" label="Loading..." />
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : category ? (
                        <div>
                            <h1 className={`${title({size:"md", color:"yellow"})} uppercase flex justify-center p-2`}>{category.name}</h1>
                            <div className="m-4 flex gap-4 justify-center">
                                <Image key={category.id} src={category.image} alt={category.name} width={200} height={200} />
                            </div>

                            <h2 className={subtitle()}>Products:</h2>
                            <ListboxWrapper>
                                <Listbox
                                    disallowEmptySelection
                                    aria-label="Products"
                                    variant="faded"
                                //onSelectionChange={setSelectedKeys}
                                >
                                    {category.products.map((item, index) => (
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
                                        category.bundles.map((item, index) => (
                                            <ListboxItem key={index} >{item.name}</ListboxItem>
                                        ))
                                    }
                                </Listbox>
                            </ListboxWrapper>
                        </div>
                    ) : (
                        <p>No category found</p>
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