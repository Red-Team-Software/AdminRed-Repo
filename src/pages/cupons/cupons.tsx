import { ModalTarget } from "@/types";
import { title } from "@/components/primitives";
import ButtonsPagination from "@/components/buttons-pagination";
import DefaultLayout from "@/layouts/default";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import useShowList from "@/hooks/use-showlist";
import DeleteModal from "@/components/delete-modal";
import useCupons, { Cupon } from "@/hooks/cupons/use-cupons";
import CuponForm from "./cuponForm";

function CuponsPage() {

    const { cupons, isLoading, error, page, handlePage, deleteCupon } = useCupons();

    const { isModalOpen, modalTargetState, selectedItem, handleCloseModal, handleOpenModal } = useShowList<Cupon>(cupons);


    return (
        <DefaultLayout>
            <section className="flex flex-col items-center py-4 md:py-10">
                <div className="container mx-auto text-center justify-center">
                    <div className="flex items-end justify-between">
                        <h1 className={title()}>Cupons List Page</h1>
                        <Button color="success" size="md" className="text-white" onPress={() => { handleOpenModal(ModalTarget.INSERT) }}>Add ➕</Button>
                    </div>

                    <Table aria-label="promotion list" className="my-8 w-full">
                        <TableHeader>
                            <TableColumn>CODE</TableColumn>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>DISCOUNT</TableColumn>
                            <TableColumn>STATE</TableColumn>
                            <TableColumn>ACTIONS</TableColumn>
                        </TableHeader>
                        {isLoading ? (
                            <TableBody emptyContent={"loading..."}>{[]}</TableBody>
                        ) : error ? (
                            <TableBody emptyContent={`Error: ${error}`}>{[]}</TableBody>
                        ) : cupons && cupons.length > 0 ? (
                            <TableBody>
                                {cupons.map((cup) => (
                                    <TableRow key={cup.id}>
                                        <TableCell>{cup.code}</TableCell>
                                        <TableCell>{cup.name}</TableCell>
                                        <TableCell>{cup.discount * 100} %</TableCell>
                                        <TableCell>{cup.state ? 'Active' : 'Inactive'}</TableCell>
                                        <TableCell className="flex gap-1 items-center">
                                            <Button color="warning" size="sm" variant="flat" onPress={() => handleOpenModal(ModalTarget.EDIT, cup.id)}>Edit</Button>
                                            <Button color="danger" size="sm" variant="flat" onPress={() => handleOpenModal(ModalTarget.DELETE, cup.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : <TableBody emptyContent={`No promotions to show`}>{[]}</TableBody>}
                    </Table>


                    <ButtonsPagination
                        currentPage={page}
                        isLastPage={cupons.length < 10}
                        handlePage={handlePage}
                    />
                </div>
            </section>


            {isModalOpen && modalTargetState === ModalTarget.INSERT && (
                <CuponForm
                    isOpen={isModalOpen}
                    onOpen={handleCloseModal}
                />
            )}


            {isModalOpen && modalTargetState === ModalTarget.EDIT && (
                <CuponForm
                    isOpen={isModalOpen}
                    onOpen={handleCloseModal}
                    id={selectedItem!.id}
                />
            )}


            {isModalOpen && modalTargetState === ModalTarget.DELETE && (
                <DeleteModal
                    title={selectedItem!.name}
                    isOpen={isModalOpen}
                    onOpen={handleCloseModal}
                    onConfirm={() => {
                        deleteCupon(selectedItem!.id);
                        handleCloseModal();
                    }}
                />
            )}

        </DefaultLayout>
    )
}

export default CuponsPage;