import { title } from "@/components/primitives";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Button } from "@nextui-org/react";
import useProducts from "@/hooks/use-products";
import DefaultLayout from "@/layouts/default";
import ButtonsPagination from "@/components/buttons-pagination";

export default function ProductsPage() {

  const {products, isLoading, error, page, handlePage} = useProducts();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center py-4 md:py-10">
        <div className="container mx-auto text-center justify-center">
          <h1 className={title()}>Products List Page</h1>

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
                        <Button color="primary" size="sm" variant="flat">View</Button>
                        <Button color="warning" size="sm" variant="flat">Edit</Button>
                        <Button color="danger" size="sm" variant="flat">Delete</Button>
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
    </DefaultLayout>
  );
}


