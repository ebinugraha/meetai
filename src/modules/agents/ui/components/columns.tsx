"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentGetMany, AgentGetOne } from "../../types";
import { GenerateAvatar } from "@/components/generate-avatar";
import { CornerDownLeft, CornerDownRightIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agents",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <GenerateAvatar
            seed={row.original.name}
            variant="botttsNeutral"
            className="size-6"
          />
          <span className="font-medium capitalize">{row.original.name}</span>
        </div>
        <div className="ml-2 flex items-center gap-x-2">
          <CornerDownRightIcon className="size-3 text-muted-foreground" />
          <span className="text-xs max-w-[200px] text-muted-foreground capitalize truncate">
            {row.original.instruction}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "meetingCount",
    header: "Meeting Count",
    cell: ({ row }) => (
      <Badge
        variant={"outline"}
        className="flex items-center gap-x-2 [&>svg]:size-4"
      >
        <VideoIcon className="text-blue-700" />
        <span className="font-medium">
          {row.original.meetingCount}{" "}
          {row.original.meetingCount === 1 ? "meeting" : "meetings"}
        </span>
      </Badge>
    ),
  },
];
