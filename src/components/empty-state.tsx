import { Loader2Icon, TriangleAlert } from "lucide-react";
import Image from "next/image";

interface Props {
  title: string;
  description?: string;
  imageUrl?: string
}

export const EmptyState = ({ title, description, imageUrl = "/empty_placeholder.svg" }: Props) => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Image src={imageUrl} alt="logo" width={240} height={240} />
      <div className="flex flex-col gap-y-6 text-center max-w-md mx-auto">
        <p className="text-lg font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
