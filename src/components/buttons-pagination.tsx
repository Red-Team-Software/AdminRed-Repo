import { Button } from "@nextui-org/react";

interface ButtonsPaginationProps {
    currentPage: number;
    isLastPage: boolean;
    handlePage: (page: number) => void;
}

export default function ButtonsPagination({
    currentPage,
    isLastPage,
    handlePage,
}: ButtonsPaginationProps) {
    return (
        <div className="flex justify-center mt-4 items-center">
            <Button size="sm" variant="ghost" onClick={() => handlePage(currentPage-1)} isDisabled={ currentPage === 1 }>
                Previous
            </Button>
            <span className="mx-2 text-sm font-semibold">Page {currentPage}</span>
            <Button size="sm" variant="ghost" onClick={ () => handlePage(currentPage+1) } isDisabled={ isLastPage }>
                Next
            </Button>
        </div>
    )
}
