import { BanIcon, Video } from "lucide-react";
import { EmptyState } from "../../../../components/empty-state";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";


export const CancelledState = () => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        title="Meeting cancelled"
        description="This meeting was cancelled"
        imageUrl="/cancelled_placeholder.svg"
      />
    </div>
  );
};
