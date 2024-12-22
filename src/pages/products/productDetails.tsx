
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

interface ProductDetailsPageProps {
    id: string;
    isOpen: boolean;
    onOpen: () => void;
}

export default function ProductDetailsPage({ id, isOpen, onOpen }: ProductDetailsPageProps) {

    const { product, isLoading, error } = useProductDetail(id);

    const container = document.getElementById('overlays') as HTMLElement;
    return ReactDOM.createPortal(

        <Modal isOpen={isOpen} scrollBehavior="inside" size="4xl" onClose={onOpen} >
            <ModalContent>
                <ModalHeader className="flex justify-center">Product Details</ModalHeader>
                <ModalBody>
                    {isLoading ? (
                        <Spinner size="lg" color="warning" label="Loading..." />
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : product ? (
                        <div>
                            <h1 className="uppercase text-center font-bold text-purple-600 text-3xl">{product.name}</h1>
                            <div className="m-4 flex gap-4 justify-center">
                                {product.images.map((image, index) => (
                                    <Image key={index} src={image} alt={product.name} width={200} height={200} />
                                ))}
                            </div>

                            <h2 className="mt-4 font-bold text-xl">Description:</h2>
                            <p>{product.description}</p>

                            <div className="mt-2 flex gap-4 items-end font-bold text-xl">
                                <h2>Price:</h2>
                                <p className="text-3xl text-purple-600">{product.price} {product.currency}</p>
                            </div>

                            <div className="mt-2 flex gap-4 items-end font-bold text-xl">
                                <h2>In Stock:</h2>
                                <p className="text-3xl text-purple-600">{product.stock}</p>
                            </div>

                            <div className="mt-2 flex gap-4 items-end font-bold text-xl">
                                <h2>Weight:</h2>
                                <p className="text-3xl text-purple-600">{product.weigth} {product.measurement}</p>
                            </div>

                            <h2 className="mt-4 font-bold text-xl">Promotions:</h2>
                            <Listbox
                                disallowEmptySelection
                                aria-label="Promotions"
                                variant="faded"
                                //onSelectionChange={setSelectedKeys}
                            >
                                {product.promotion.map((item, index) => (
                                    <ListboxItem key={index} className="bg-slate-400 bg-opacity-40">{item.name} - {item.discount * 100}%</ListboxItem>
                                ))}
                            </Listbox>
                        

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