"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingsForm } from "./meetings-form";
import { useRouter } from "next/navigation";

interface NewMeetingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingsDialog = ({
  open,
  onOpenChange,
}: NewMeetingsDialogProps) => {
  const router = useRouter();

  return (
    <ResponsiveDialog
      title="New Meetings"
      description="create a new meetings"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingsForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
