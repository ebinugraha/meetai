import { BanIcon, Video } from "lucide-react";
import { EmptyState } from "../../../../components/empty-state";


export const ProcessingState = () => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        title="Summary processing"
        description="Summary is processing, please wait"
        imageUrl="/processing_placeholder.svg"
      />
    </div>
  );
};
