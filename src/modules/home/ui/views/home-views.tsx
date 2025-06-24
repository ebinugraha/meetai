"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const HomeView = () => {

  const trpc = useTRPC()
  const { data } = useQuery(trpc.hello.queryOptions({text: "febrian"}))

  return (
    <div className="flex flex-col gap-y-4 p-10">  
      {data?.greeting}
    </div>
  );
};
