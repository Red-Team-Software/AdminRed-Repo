import { title } from "@/components/primitives";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Button } from "@nextui-org/react";
import useBundles, { Bundle } from "@/hooks/bundles/use-bundles";
import DefaultLayout from "@/layouts/default";
import ButtonsPagination from "@/components/buttons-pagination";
import BundleDetailsPage from "./bundleDetails";
import BundleForm from "./bundleForm";
import DeleteModal from "@/components/delete-modal";
import { ModalTarget } from "@/types";
import useShowList from "@/hooks/use-showlist";


export default function BundlesPage() {

  const { bundles, isLoading, error, page, handlePage, deleteBundle } = useBundles();

  const {isModalOpen, modalTargetState ,selectedItem, handleCloseModal, handleOpenModal } = useShowList<Bundle>(bundles);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center py-4 md:py-10">
        
        <div className="container mx-auto text-center justify-center">
          <div className="flex items-end justify-between">
            <h1 className={title()}>Bundle List Page</h1>
            <Button color="success" size="lg" className="text-white" onPress={() => handleOpenModal(ModalTarget.INSERT)}>Add ➕</Button>
          </div>
          
          <Table isStriped aria-label="products list" className="my-8 w-full">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>CURRENCY</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
              {isLoading ? (
                <TableBody emptyContent={"loading..."}>{[]}</TableBody>
              ) : error? (
                <TableBody emptyContent={`Error: ${error}`}>{[]}</TableBody>
              ): bundles && bundles.length >0 ?(
                <TableBody>
                  {bundles.map((bun) => (
                    <TableRow key={bun.id}>
                      <TableCell>{bun.name}</TableCell>
                      <TableCell>{bun.price} $</TableCell>
                      <TableCell>{bun.currency}</TableCell>
                      <TableCell className="flex gap-1 items-center">
                        <Button color="primary" size="sm"  variant="flat" onPress={() => handleOpenModal(ModalTarget.VIEW, bun.id)}>View</Button>
                        <Button color="warning" size="sm" variant="flat" onPress={() => handleOpenModal(ModalTarget.EDIT, bun.id)}>Edit</Button>
                        <Button color="danger" size="sm" variant="flat" onPress={() => handleOpenModal(ModalTarget.DELETE, bun.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ): <TableBody emptyContent={`No products to show`}>{[]}</TableBody>}
          </Table>

          
          <ButtonsPagination
          currentPage={ page }
          isLastPage= { bundles.length <10 }
          handlePage= {handlePage}
          />
        </div>
      </section>

      {isModalOpen && modalTargetState === ModalTarget.VIEW && (
        <BundleDetailsPage
          id={selectedItem!.id}
          isOpen={isModalOpen}
          onOpen={handleCloseModal}
        />
      )} 

      {isModalOpen && modalTargetState === ModalTarget.INSERT && (
        <BundleForm
          isOpen={isModalOpen}
          onOpen={handleCloseModal}
        />
      )} 

      {isModalOpen && modalTargetState === ModalTarget.EDIT && (
        <BundleForm
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
            deleteBundle(selectedItem!.id);
            handleCloseModal();
          }}
        />
      )} 

    </DefaultLayout>
  );
}


