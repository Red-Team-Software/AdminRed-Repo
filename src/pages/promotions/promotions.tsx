import { ModalTarget } from "@/types";
import { title } from "@/components/primitives";
import usePromotions, { Promotion } from "@/hooks/promotions/use-promotions"
import ButtonsPagination from "@/components/buttons-pagination";
import DefaultLayout from "@/layouts/default";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import useShowList from "@/hooks/use-showlist";
import PromotionDetailsPage from "./promotionsDetails";
import DeleteModal from "@/components/delete-modal";
import PromotionForm from "./promotionForm";

function PromotionsPage() {

    const { promotions, isLoading, error, page, handlePage, deletePromotion } = usePromotions();

    const { isModalOpen, modalTargetState, selectedItem, handleCloseModal, handleOpenModal } = useShowList<Promotion>(promotions);
    

    return (
        <DefaultLayout>
            <section className="flex flex-col items-center py-4 md:py-10">
                <div className="container mx-auto text-center justify-center">
                    <div className="flex items-end justify-between">
                        <h1 className={title()}>Promotions List Page</h1>
                        <Button color="success" size="md" className="text-white" onPress={() =>{handleOpenModal(ModalTarget.INSERT)}}>Add ➕</Button>
                    </div>

                    <Table isStriped aria-label="promotion list" className="my-8 w-full">
                        <TableHeader>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>IS AVAILABLE</TableColumn>
                            <TableColumn>DISCOUNT</TableColumn>
                            <TableColumn>ACTIONS</TableColumn>
                        </TableHeader>
                        {isLoading ? (
                            <TableBody emptyContent={"loading..."}>{[]}</TableBody>
                        ) : error ? (
                            <TableBody emptyContent={`Error: ${error}`}>{[]}</TableBody>
                        ) : promotions && promotions.length > 0 ? (
                            <TableBody>
                                {promotions.map((prom) => (
                                    <TableRow key={prom.id}>
                                        <TableCell>{prom.name}</TableCell>
                                        <TableCell>{ prom.avaleableState? 'Si' : 'No' }</TableCell>
                                        <TableCell>{prom.discount * 100} %</TableCell>
                                        <TableCell className="flex gap-1 items-center">
                                            <Button color="primary" size="sm" variant="flat" onPress={() => handleOpenModal(ModalTarget.VIEW, prom.id)}>View</Button>
                                            <Button color="warning" size="sm" variant="flat" onPress={() => handleOpenModal(ModalTarget.EDIT, prom.id)}>Edit</Button>
                                            <Button color="danger" size="sm" variant="flat" onPress={() => handleOpenModal(ModalTarget.DELETE, prom.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : <TableBody emptyContent={`No promotions to show`}>{[]}</TableBody>}
                    </Table>


                    <ButtonsPagination
                        currentPage={page}
                        isLastPage={promotions.length < 10}
                        handlePage={handlePage}
                    />
                </div>
            </section>

            {isModalOpen && modalTargetState === ModalTarget.VIEW && (
                <PromotionDetailsPage
                    id={selectedItem!.id}
                    isOpen={isModalOpen}
                    onOpen={handleCloseModal}
                />
            )}

            {isModalOpen && modalTargetState === ModalTarget.INSERT && (
                <PromotionForm
                    isOpen={isModalOpen}
                    onOpen={handleCloseModal}
                />
            )}

            {/*
            {isModalOpen && modalTargetState === ModalTarget.EDIT && (
                <ProductForm
                    isOpen={isModalOpen}
                    onOpen={handleCloseModal}
                    id={selectedProduct!.id}
                />
            )}
            */}

            {isModalOpen && modalTargetState === ModalTarget.DELETE && (
                <DeleteModal
                    title={selectedItem!.name}
                    isOpen={isModalOpen}
                    onOpen={handleCloseModal}
                    onConfirm={() => {
                        deletePromotion(selectedItem!.id);
                        handleCloseModal();
                    }}
                />
            )} 

        </DefaultLayout>
    )
}

export default PromotionsPage