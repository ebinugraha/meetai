"use client";

import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/data-pagination";

export const AgentsViews = () => {
  const router = useRouter();
  const trpc = useTRPC();

  const [filters, setFilters] = useAgentsFilters();

  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );

  return (
    <div className="flex-1 flex flex-col pb-4 px-4 md:px-8 gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`/agents/${row.id}`)}
      />
      <DataPagination
        onPageChange={(page) => setFilters({ page })}
        totalPage={data.totalPages}
        page={filters.page}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join meetings. Each agent will follow your instruction and can interact with any participant"
        />
      )}
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

export const AgentsSkeletonViews = () => {
  return (
    <div className="grid grid-cols-2 gap-x-2 items-center border-b bg-white p-4">
      {/* Bagian Kiri: Avatar dan Teks */}
      <div className="flex flex-col gap-y-3 ">
        <div className="flex gap-x-2 items-center">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-4 w-[150px]" />
      </div>
      {/* Bagian Kanan: Badge Meetings */}
      <Skeleton className="h-5 w-[100px]  rounded-md" />
    </div>
  );
};

export const AgentsSkeletonLoading = () => {
  return (
    <div className="flex flex-col md:mx-8 rounded-lg overflow-hidden bg-amber-300 border">
      <AgentsSkeletonViews />
      <AgentsSkeletonViews />
    </div>
  );
};
