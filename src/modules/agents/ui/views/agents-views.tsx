"use client";

import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const AgentsViews = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div className="flex-1 flex flex-col pb-4 px-4 md:px-8 gap-y-4">
      <DataTable data={data} columns={columns} />
      {data.length === 0 && (
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
