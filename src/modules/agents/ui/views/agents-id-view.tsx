"use client";

import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GenerateAvatar } from "@/components/generate-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/agent-update-dialog";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({
      id: agentId,
    })
  );

  const removeAgents = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );
        router.push("/agents");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove ${data.meetingCount} associated meetings`
  );

  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

  const handleRemove = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await removeAgents.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        onOpenChange={setUpdateAgentDialogOpen}
        open={updateAgentDialogOpen}
        initialsValues={data}
      />
      <div className="flex-1 flex flex-col pb-4 py-5 px-4 md:px-8 gap-y-4">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemove}
        />
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
            <div className="flex items-center gap-x-6">
              <GenerateAvatar
                seed={data.name}
                variant="botttsNeutral"
                className="size-10"
              />
              <h2 className="font-medium">{data.name}</h2>
            </div>
            <Badge
              variant={"outline"}
              className="flex items-center gap-x-2 [&>svg]:size-4"
            >
              <VideoIcon className="text-blue-600" />
              {data.meetingCount}{" "}
              {data.meetingCount === 1 ? "meeting" : "meetings"}
            </Badge>
            <div className="flex flex-col gap-y-1">
              <h1 className="font-medium text-lg">Instruction</h1>
              <h1 className="text-neutral-800">{data.instruction}</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const AgentsIdErrorViews = () => {
  return (
    <ErrorState
      title="can't reach this page"
      description="something wen't wrong"
    />
  );
};
export const AgentsIdLoadingViews = () => {
  return (
    <div className="px-8">
      <div className="space-y-1">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-7 w-32" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        {/* Content Card Skeleton */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-6 space-y-6">
          {/* Meetings Badge Skeleton */}
          <Skeleton className="h-8 w-32 rounded-md" />

          {/* Instruction Section Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
};
