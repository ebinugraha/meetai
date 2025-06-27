"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, Video, XIcon } from "lucide-react";
import { NewMeetingsDialog } from "./meetings-new-dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { MeetingStatusFilter } from "./meetings-status-filter";
import { MeetingAgentIdFilters } from "./meetings-agentid-filter";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const MeetingsListHeader = () => {
  const [isOpenMeeting, setIsOpenMeeting] = useState(false);
  const [filters, setFilters] = useMeetingsFilters();

  const isAnyFiltersModified =
    !!filters.agentId || !!filters.status || !!filters.search;

  const onClearFilters = () => {
    setFilters({
      agentId: "",
      status: null,
      search: "",
      page: 1,
    });
  };

  return (
    <>
      <NewMeetingsDialog onOpenChange={setIsOpenMeeting} open={isOpenMeeting} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Meetings</h5>
          <Button onClick={() => setIsOpenMeeting(true)} size={"sm"}>
            <Video className="size-3" />
            <span className="text-xs">New Meeting</span>
          </Button>
        </div>
        <ScrollArea>
          <div className="flex items-center gap-x-2">
            <MeetingsSearchFilter />
            <MeetingStatusFilter />
            <MeetingAgentIdFilters />
            {isAnyFiltersModified && (
              <Button variant={"outline"} onClick={onClearFilters}>
                <XIcon />
                Clear filter
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal"/>
        </ScrollArea>
      </div>
    </>
  );
};
