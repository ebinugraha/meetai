import { auth } from "@/lib/auth";
import { ListHeader } from "@/modules/agents/ui/components/agent-list-header";
import {
  AgentsErrorViews,
  AgentsViews,
} from "@/modules/agents/ui/views/agents-views";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const AgentsPage = async () => {

    const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    if (!session) {
      redirect("/auth/sign-in");
    }
  
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <>
      {" "}
      <ListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading skeleton...</p>}>
          <ErrorBoundary fallback={<AgentsErrorViews />}>
            <AgentsViews />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default AgentsPage;
