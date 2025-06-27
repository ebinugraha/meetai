import { Button } from "@/components/ui/button";

interface AgentsDataPaginationProps {
  page: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export const DataPagination = ({
  page,
  totalPage,
  onPageChange,
}: AgentsDataPaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-muted-foreground text-sm">
        Page {page} of {totalPage || 1}
      </div>
      <div className="flex justify-end items-center space-x-2 py-4">
        <Button
          variant={"outline"}
          size={"sm"}
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Prev
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          disabled={page === totalPage || totalPage === 0}
          onClick={() => onPageChange(Math.min(totalPage, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
