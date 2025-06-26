"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, Video } from "lucide-react";
import { NewMeetingsDialog } from "./meetings-new-dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const MeetingsListHeader = () => {
  const [isOpenMeeting, setIsOpenMeeting] = useState(false);
  
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
        <div className="flex items-center gap-x-2">Todo filters</div>
      </div>
    </>
  );
};
