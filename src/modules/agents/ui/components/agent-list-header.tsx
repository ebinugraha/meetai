"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { NewAgentDialog } from "./agent-new-dialog";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { AgentsSearchFilter } from "./agent-search-filter";
import { DEFAULT_PAGE } from "@/constant";

export const ListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useAgentsFilters();

  const isAnyFiltersModified = !!filters.search;

  const onClearFilters = () => {
    setFilters({
      page: DEFAULT_PAGE,
      search: "",
    });
  };

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Agents</h5>
          <Button onClick={() => setIsDialogOpen((open) => !open)} size={"sm"}>
            <PlusIcon className="size-3" />
            <span className="text-xs">New Agent</span>
          </Button>
        </div>
        <div className="flex items-center gap-x-2">
          <AgentsSearchFilter />
          {isAnyFiltersModified && (
            <Button variant={"outline"} onClick={onClearFilters}>
              <XIcon />
              Clear filter
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
