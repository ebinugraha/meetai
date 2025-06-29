import { auth } from "@/lib/auth";
import { loadsearchParams } from "@/modules/meetings/search-params";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import {
  AgentsErrorViews,
  MeetingViews,
} from "@/modules/meetings/ui/views/meeting-views";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface MeetingsProps {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: MeetingsProps) => {
  const filters = await loadsearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    })
  );

  return (
    <>
      <MeetingsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <ErrorBoundary fallback={<AgentsErrorViews />}>
            <MeetingViews />;
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default Page;
