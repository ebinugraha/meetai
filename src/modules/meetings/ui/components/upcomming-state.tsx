import { BanIcon, Video } from "lucide-react";
import { EmptyState } from "../../../../components/empty-state";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";

interface Props {
  meetingId: string;
  isCancelling: boolean;
  onCancelMeeting: () => void;
}

export const UpcommingState = ({
  meetingId,
  isCancelling,
  onCancelMeeting,
}: Props) => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        title="Not started yet"
        description="if you click started the meeting, summary will appear"
        imageUrl="/upcomming_placeholder.svg"
      />
      <div className="flex flex-col-reverse gap-2 lg:flex-row lg:justify-center-safe w-full items-center">
        <Button
          className=""
          variant={"secondary"}
          onClick={onCancelMeeting}
          disabled={isCancelling}
        >
          <BanIcon />
          Cancel meeting
        </Button>
        <Button asChild disabled={isCancelling}>
          <Link href={`/call/${meetingId}`}>
            <Video />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
