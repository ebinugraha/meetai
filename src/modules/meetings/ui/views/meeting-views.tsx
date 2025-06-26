"use client";

import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export const MeetingViews = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export const AgentsErrorViews = () => {
  return (
    <ErrorState
      title="can't reach this page"
      description="something wen't wrong"
    />
  );
};