import { ListboxWrapper } from '@/components/listbox-wrapper';
import { subtitle, title } from '@/components/primitives';
import useBundleDetails from '@/hooks/bundles/use-bundle-details';
import { DetailsPageProps } from '@/types'
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, Spinner, Listbox, ListboxItem, ModalFooter, Image } from '@nextui-org/react';
import ReactDOM from 'react-dom';

function BundleDetailsPage({ id, isOpen, onOpen }: DetailsPageProps) {
    const { bundle, isLoading, error } = useBundleDetails(id);

    const container = document.getElementById('overlays') as HTMLElement;
    return ReactDOM.createPortal(

        <Modal isOpen={isOpen} scrollBehavior="inside" size="4xl" onClose={onOpen} >
            <ModalContent>
                <ModalHeader className={`${title({ size: "sm" })} text-center`}>Bundle Details</ModalHeader>
                <ModalBody>
                    {isLoading ? (
                        <Spinner size="lg" color="warning" label="Loading..." />
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : bundle ? (
                        <div>
                            <h1 className={`${title({ size: "md", color: "yellow" })} uppercase flex justify-center p-2`}>{bundle.name}</h1>
                            <div className="m-4 flex gap-4 justify-center">
                                {bundle.images.map((image, index) => (
                                    <Image key={index} src={image} alt={bundle.name} width={200} height={200} />
                                ))}
                            </div>

                            <h2 className={subtitle()}>Description:</h2>
                            <p>{bundle.description}</p>

                            <div className="mt-4 flex gap-4 items-end">
                                <h2 className="text-lg lg:text-xl text-default-600 block">Price:</h2>
                                <p className={title({ size: "sm", color: "yellow" })}>{bundle.price} {bundle.currency}</p>
                            </div>

                            <div className="mt-4 flex gap-4 items-end">
                                <h2 className="text-lg lg:text-xl text-default-600 block">In Stock:</h2>
                                <p className={title({ size: "sm", color: "yellow" })}>{bundle.stock}</p>
                            </div>

                            <div className="my-4 flex gap-4 items-end">
                                <h2 className="text-lg lg:text-xl text-default-600 block">Weight:</h2>
                                <p className={title({ size: "sm", color: "yellow" })}>{bundle.weight} {bundle.measurement}</p>
                            </div>

                            <h2 className={subtitle()}>Products:</h2>
                            <ListboxWrapper>
                                <Listbox
                                    disallowEmptySelection
                                    aria-label="Products"
                                    variant="faded"
                                //onSelectionChange={setSelectedKeys}
                                >
                                    {bundle.products.map((item, index) => (
                                        <ListboxItem key={index} >{item.name}</ListboxItem>
                                    ))}
                                </Listbox>
                            </ListboxWrapper>

                            <h2 className={subtitle()}>Promotions:</h2>
                            <ListboxWrapper>
                                <Listbox
                                    disallowEmptySelection
                                    aria-label="Promotions"
                                    variant="faded"
                                //onSelectionChange={setSelectedKeys}
                                >
                                    {bundle.discount.map((item, index) => (
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

export default BundleDetailsPage