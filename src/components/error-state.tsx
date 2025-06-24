import { Loader2Icon, TriangleAlert } from "lucide-react";

interface Props {
    title: string;
    description?:string
}

export const ErrorState = ({title, description}: Props) => {
    return (
        <div className="py-4 px-8 flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                <TriangleAlert className="text-primary size-6"/>
                <div className="flex flex-col gap-y-2 text-center">
                    <p className="text-lg font-medium">{title}</p>
                    <p className="text-sm">{description}</p>
                </div>
            </div>
        </div>
    )
}