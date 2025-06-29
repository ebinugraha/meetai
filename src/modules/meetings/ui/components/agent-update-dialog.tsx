"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingsForm } from "./meetings-form";
import { MeetingGetOne } from "../../types";

interface UpdateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialsValues?: MeetingGetOne;
}

export const UpdateMeetingDialog = ({
  open,
  onOpenChange,
  initialsValues
}: UpdateMeetingDialogProps) => {
  return (
    <ResponsiveDialog
      title="New agent"
      description="update a new meeting"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingsForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialsValues={initialsValues}
      />
    </ResponsiveDialog>
  );
};
