"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const HomeView = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (!session) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex flex-col gap-y-4 p-10">
      <span>{session.user.name}</span>
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/auth/sign-in");
              },
            },
          })
        }
      >
        Sign out
      </Button>
    </div>
  );
};
