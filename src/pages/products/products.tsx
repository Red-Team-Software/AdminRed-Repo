import { useState } from "react";
import { title } from "@/components/primitives";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Button } from "@nextui-org/react";
import useProducts, { Product } from "@/hooks/products/use-products";
import DefaultLayout from "@/layouts/default";
import ButtonsPagination from "@/components/buttons-pagination";
import ProductDetailsPage from "./productDetails";
import ProductForm from "./productForm";
import DeleteModal from "@/components/delete-modal";

enum ModalTarget {"VIEW", "INSERT", "EDIT", "DELETE"}

export default function ProductsPage() {

  const {products, isLoading, error, page, handlePage, deleteProduct} = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTargetState, setModalTargetState] = useState<ModalTarget>(ModalTarget.VIEW);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenModal = (target: ModalTarget, id?: string) => {
    setModalTargetState(target);
    if (id) {
      setSelectedProduct(products.find((product) => product.id === id) || null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center py-4 md:py-10">
        
        <div className="container mx-auto text-center justify-center">
          <h1 className={title()}>Products List Page</h1>
          <div className="flex items-end justify-end">
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
              ): products && products.length >0 ?(
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price} $</TableCell>
                      <TableCell>{product.currency}</TableCell>
                      <TableCell className="flex gap-1 justify-center items-center">
                        <Button color="primary" size="sm"  variant="flat" onPress={() => handleOpenModal(ModalTarget.VIEW, product.id)}>View</Button>
                        <Button color="warning" size="sm" variant="flat" onPress={() => handleOpenModal(ModalTarget.EDIT, product.id)}>Edit</Button>
                        <Button color="danger" size="sm" variant="flat" onPress={() => handleOpenModal(ModalTarget.DELETE, product.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ): <TableBody emptyContent={`No products to show`}>{[]}</TableBody>}
          </Table>

          
          <ButtonsPagination
          currentPage={ page }
          isLastPage= { products.length <10 }
          handlePage= {handlePage}
          />
        </div>
      </section>

      {isModalOpen && modalTargetState === ModalTarget.VIEW && (
        <ProductDetailsPage
          id={selectedProduct!.id}
          isOpen={isModalOpen}
          onOpen={handleCloseModal}
        />
      )} 

      {isModalOpen && modalTargetState === ModalTarget.INSERT && (
        <ProductForm
          isOpen={isModalOpen}
          onOpen={handleCloseModal}
        />
      )} 

      {isModalOpen && modalTargetState === ModalTarget.EDIT && (
        <ProductForm
        isOpen={isModalOpen}
        onOpen={handleCloseModal}
        id={selectedProduct!.id}
      />
      )} 

      {isModalOpen && modalTargetState === ModalTarget.DELETE && (
        <DeleteModal
          title={selectedProduct!.name}
          isOpen={isModalOpen}
          onOpen={handleCloseModal}
          onConfirm={() => {
            deleteProduct(selectedProduct!.id);
            handleCloseModal();
          }}
        />
      )} 

    </DefaultLayout>
  );
}


