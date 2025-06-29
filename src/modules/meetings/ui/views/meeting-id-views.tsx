"use client";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MeetingsIdViewHeader } from "../components/meetings-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { UpdateMeetingDialog } from "../components/agent-update-dialog";
import { UpcommingState } from "@/modules/meetings/ui/components/upcomming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";

interface Props {
  meetingsId: string;
}

export const MeetingIdViews = ({ meetingsId }: Props) => {
  console.log(meetingsId);

  const router = useRouter();
  const trpc = useTRPC();
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove associated meetings`
  );
  const [isOpenMeetingUpdateDialog, setIsOpenMeetingUpdateDialog] =
    useState(false);

  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingsId,
    })
  );

  const remove = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        toast.success(`${data.name} Meeting removed`);
        router.push("/meetings");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    })
  );

  const handleRemove = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await remove.mutateAsync({ id: data.id });
  };

  const isActive = data.status == "active";
  const isUpcoming = data.status == "upcoming";
  const isCompleted = data.status == "completed";
  const isProcessing = data.status == "processing";
  const isCancelled = data.status == "cancelled";

  return (
    <>
      <UpdateMeetingDialog
        onOpenChange={setIsOpenMeetingUpdateDialog}
        open={isOpenMeetingUpdateDialog}
        initialsValues={data}
      />
      <RemoveConfirmation />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingsIdViewHeader
          meetingId={data.id}
          meetingName={data.name}
          onEdit={() => setIsOpenMeetingUpdateDialog((open) => !open)}
          onRemove={handleRemove}
        />
        {isUpcoming && (
          <UpcommingState
            isCancelling={false}
            meetingId={meetingsId}
            onCancelMeeting={() => {}}
          />
        )}
        {isActive && <ActiveState meetingId={meetingsId} />}
        {isProcessing && <ProcessingState/>}
        {isCancelled && <CancelledState/>}
      </div>
    </>
  );
};
