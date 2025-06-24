import { authClient } from "@/lib/auth-client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GenerateAvatar } from "@/components/generate-avatar";
import { ChevronDown, CreditCard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export const DashboardUserButton = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/sign-in");
        },
      },
    });
  };

  if (isPending || !data?.user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border gap-x-3 border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
        {data.user.image ? (
          <Avatar>
            <AvatarImage src={data.user.image} />
          </Avatar>
        ) : (
          <GenerateAvatar seed={data.user.name} variant="botttsNeutral" />
        )}
        <div className="flex flex-col gap-0.5 overflow-hidden flex-1 min-w-0 text-left">
          <span className="text-sm truncate w-full">{data.user.name}</span>
          <span className="text-xs truncate w-full">{data.user.email}</span>
        </div>
        <ChevronDown className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-sm">{data.user.name}</span>
            <span className="text-sm text-muted-foreground font-normal truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
          Billing
          <CreditCard className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center justify-between cursor-pointer"
        >
          Logout
          <LogOut className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
