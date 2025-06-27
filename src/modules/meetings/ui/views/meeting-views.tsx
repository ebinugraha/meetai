"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";
import { useRouter } from "next/navigation";

export const MeetingViews = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const [filters, setFilters] = useMeetingsFilters();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    })
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => {
          router.push(`/meetings/${row.id}`);
        }}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Create an agent to join meetings. Each agent will follow your instruction and can interact with any participant"
        />
      )}
      <DataPagination
        onPageChange={(page) => setFilters({ page })}
        totalPage={data.totalPages}
        page={filters.page}
      />
    </div>
  );
};

export const AgentsErrorViews = () => {
  return (
    <ErrorState
      title="can't reach this page"
      description="something wen't wrong"
    />
  );
};
