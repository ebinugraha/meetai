"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";

interface UpdateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialsValues?: AgentGetOne;
}

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  initialsValues
}: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="New agent"
      description="create a new agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialsValues={initialsValues}
      />
    </ResponsiveDialog>
  );
};
