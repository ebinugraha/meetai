import {
  AgentsErrorViews,
  AgentsViews,
} from "@/modules/agents/ui/views/agents-views";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const AgentsPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading skeleton...</p>}>
        <ErrorBoundary fallback={<AgentsErrorViews />}>
          <AgentsViews />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default AgentsPage;
