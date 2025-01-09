import { ModalTarget } from "@/types";
import { title } from "@/components/primitives";
import ButtonsPagination from "@/components/buttons-pagination";
import DefaultLayout from "@/layouts/default";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Image } from "@nextui-org/react";
import useShowList from "@/hooks/use-showlist";
import DeleteModal from "@/components/delete-modal";
import useCategories, { Category } from "@/hooks/categories/use-categories";
import CategoryDetailsPage from "./categoryDetails";
import CategoryForm from "./categoryForm";

function CategoriesPage() {

  const { categories, isLoading, error, page, handlePage, deleteCategory, fetchCategories } = useCategories();

  const { isModalOpen, modalTargetState, selectedItem, handleCloseModal, handleOpenModal } = useShowList<Category>(categories);


  return (
    <DefaultLayout>
      <section className="flex flex-col items-center py-4 md:py-10">
        <div className="container mx-auto text-center justify-center">
          <div className="flex items-end justify-between">
            <h1 className={title()}>Categories List Page</h1>
            <Button color="success" size="md" className="text-white" onPress={() => { handleOpenModal(ModalTarget.INSERT) }}>Add ➕</Button>
          </div>

          <Table aria-label="promotion list" className="my-8 w-full">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>IMAGE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            {isLoading ? (
              <TableBody emptyContent={"loading..."}>{[]}</TableBody>
            ) : error ? (
              <TableBody emptyContent={`Error: ${error}`}>{[]}</TableBody>
            ) : categories && categories.length > 0 ? (
              <TableBody>
                {categories.map((cate) => (
                  <TableRow key={cate.id}>
                    <TableCell>{cate.name}</TableCell>
                    <TableCell>
                      <Image
                        isZoomed
                        alt={cate.name}
                        src={cate.imageUrl}
                        width={75}
                      />
                    </TableCell>
                    <TableCell className="flex gap-1 items-center">
                      <Button color="primary" size="sm" variant="flat" onPress={() => handleOpenModal(ModalTarget.VIEW, cate.id)}>View</Button>
                      <Button color="warning" size="sm" variant="flat" onPress={() => handleOpenModal(ModalTarget.EDIT, cate.id)}>Edit</Button>
                      <Button color="danger" size="sm" variant="flat" onPress={() => handleOpenModal(ModalTarget.DELETE, cate.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : <TableBody emptyContent={`No categories to show`}>{[]}</TableBody>}
          </Table>


          <ButtonsPagination
            currentPage={page}
            isLastPage={categories.length < 10}
            handlePage={handlePage}
          />
        </div>
      </section>


      {isModalOpen && modalTargetState === ModalTarget.VIEW && (
        <CategoryDetailsPage
          id={selectedItem!.id}
          isOpen={isModalOpen}
          onOpen={handleCloseModal}
        />
      )}

      {isModalOpen && modalTargetState === ModalTarget.INSERT && (
        <CategoryForm
          isOpen={isModalOpen}
          onOpen={() => {
            handleCloseModal();
            fetchCategories();
          }}
        />
      )}


      {isModalOpen && modalTargetState === ModalTarget.EDIT && (
        <CategoryForm
          isOpen={isModalOpen}
          onOpen={
            () => {
              handleCloseModal();
              fetchCategories();
            }
          }
          id={selectedItem!.id}
        />
      )}


      {isModalOpen && modalTargetState === ModalTarget.DELETE && (
        <DeleteModal
          title={selectedItem!.name}
          isOpen={isModalOpen}
          onOpen={handleCloseModal}
          onConfirm={() => {
            deleteCategory(selectedItem!.id);
            handleCloseModal();
          }}
        />
      )}

    </DefaultLayout>
  )
}

export default CategoriesPage;