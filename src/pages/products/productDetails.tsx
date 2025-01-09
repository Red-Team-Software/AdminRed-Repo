import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Image,
    Button,
    Spinner,
    Listbox,
    ListboxItem,
} from "@nextui-org/react";
import ReactDOM from "react-dom";
import useProductDetail from "@/hooks/products/use-product-details";
import { DetailsPageProps } from "@/types";
import { ListboxWrapper } from "@/components/listbox-wrapper";
import { subtitle, title } from "@/components/primitives";


export default function ProductDetailsPage({ id, isOpen, onOpen }: DetailsPageProps) {

    const { product, isLoading, error } = useProductDetail(id);

    const container = document.getElementById('overlays') as HTMLElement;
    return ReactDOM.createPortal(

        <Modal isOpen={isOpen} scrollBehavior="inside" size="4xl" onClose={onOpen} >
            <ModalContent>
                <ModalHeader className={`${title({ size: "sm" })} text-center`}>Product Details</ModalHeader>
                <ModalBody>
                    {isLoading ? (
                        <Spinner size="lg" color="warning" label="Loading..." />
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : product ? (
                        <div>
                            <h1 className={`${title({ size: "md", color: "yellow" })} uppercase flex justify-center p-2`}>{product.name}</h1>
                            <div className="m-4 flex gap-4 justify-center">
                                {product.images.map((image, index) => (
                                    <Image key={index} src={image} alt={product.name} width={200} height={200} />
                                ))}
                            </div>

                            <h2 className={subtitle()}>Description:</h2>
                            <p>{product.description}</p>

                            <div className="mt-4 flex gap-4 items-end">
                                <h2 className="text-lg lg:text-xl text-default-600 block">Price:</h2>
                                <p className={title({ size: "sm", color: "yellow" })}>{product.price} {product.currency}</p>
                            </div>

                            <div className="mt-4 flex gap-4 items-end">
                                <h2 className="text-lg lg:text-xl text-default-600 block">In Stock:</h2>
                                <p className={title({ size: "sm", color: "yellow" })}>{product.stock}</p>
                            </div>

                            <div className="my-4 flex gap-4 items-end">
                                <h2 className="text-lg lg:text-xl text-default-600 block">Weight:</h2>
                                <p className={title({ size: "sm", color: "yellow" })}>{product.weight} {product.measurement}</p>
                            </div>

                            <h2 className={subtitle()}>Promotions:</h2>
                            <ListboxWrapper>
                                <Listbox
                                    disallowEmptySelection
                                    aria-label="Promotions"
                                    variant="faded"
                                //onSelectionChange={setSelectedKeys}
                                >
                                    {product.discount.map((item, index) => (
                                        <ListboxItem key={index} >{item.name} - {item.discount * 100}%</ListboxItem>
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