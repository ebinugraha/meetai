import { BanIcon, Video } from "lucide-react";
import { EmptyState } from "../../../../components/empty-state";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";

interface Props {
  meetingId: string;
}

export const ActiveState = ({
  meetingId,
}: Props) => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        title="Meeting is active"
        description="Meeting will end once all participants have left"
        imageUrl="/upcomming_placeholder.svg"
      />
      <div className="flex flex-col-reverse gap-2 lg:flex-row lg:justify-center-safe w-full items-center">
        <Button asChild>
          <Link href={`/call/${meetingId}`}>
            <Video />
            Join meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
