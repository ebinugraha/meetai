"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  ChevronRightIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface Props {
  meetingId: string;
  meetingName: string;
  onEdit: () => void;
  onRemove: () => void;
}

export const MeetingsIdViewHeader = ({
  meetingId,
  meetingName,
  onEdit,
  onRemove,
}: Props) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="font-medium text-xl">
              <Link href="/meetings">My Meetings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-foreground text-xl font-medium [&>svg]:size-4">
            <ChevronRightIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="font-medium text-xl text-foreground"
            >
              <Link href={`/meetings/$${meetingId}`}>{meetingName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {isMobile ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"sm"}>
              <span className="text-xs">Options</span>
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <PencilIcon className="size-4 text-yellow-400" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRemove}>
              <Trash2 className="size-4 text-red-400" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-x-2">
          <Button variant={"outline"} size={"sm"} onClick={onEdit}>
            <PencilIcon className="text-yellow-400" />
            <span className="text-xs">Edit</span>
          </Button>
          <Button variant={"outline"} size={"sm"} onClick={onRemove}>
            <Trash2 className="text-destructive" />
            <span className="text-xs">Remove</span>
          </Button>
        </div>
      )}
    </div>
  );
};
