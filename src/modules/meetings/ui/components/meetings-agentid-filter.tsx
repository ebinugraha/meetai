"use client";

import { useTRPC } from "@/trpc/client";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GenerateAvatar } from "@/components/generate-avatar";

export const MeetingAgentIdFilters = () => {
  const [filters, setFilters] = useMeetingsFilters();

  const trpc = useTRPC();

  const [searchAgents, setSearhAgents] = useState("");

  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      search: searchAgents,
      pageSize: 100,
    })
  );

  return (
    <CommandSelect
      placeholder="Search agents"
      className="h-9"
      options={(data?.items ?? []).map((agents) => ({
        id: agents.id,
        value: agents.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GenerateAvatar seed={agents.name} variant="botttsNeutral" />
            {agents.name}
          </div>
        ),
      }))}
      onSelect={(value) => setFilters({ agentId: value })}
      value={filters.agentId ?? ""}
      onSearch={(value) => setSearhAgents(value)}
    />
  );
};
