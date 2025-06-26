import { auth } from "@/lib/auth";
import { ListHeader } from "@/modules/agents/ui/components/agent-list-header";
import {
  AgentsErrorViews,
  AgentsSkeletonLoading,
  AgentsSkeletonViews,
  AgentsViews,
} from "@/modules/agents/ui/views/agents-views";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import type { SearchParams } from "nuqs";
import { loadsearchParams } from "@/modules/agents/search-params";
interface AgentsProps {
  searchParams: Promise<SearchParams>;
}

const AgentsPage = async ({ searchParams }: AgentsProps) => {
  const filters = await loadsearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );

  return (
    <>
      {" "}
      <ListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsSkeletonLoading />}>
          <ErrorBoundary fallback={<AgentsErrorViews />}>
            <AgentsViews />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default AgentsPage;
