"use client";

import { Input } from "@/components/ui/input";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { SearchIcon } from "lucide-react";

export const MeetingsSearchFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  return (
    <div className="relative">
      <Input
        placeholder="Search..."
        value={filters.search}
        className="h-9 w-[200px] pl-7 bg-white"
        onChange={(e) => setFilters({ search: e.target.value })}
      />
      <SearchIcon className="size-4 absolute left-2 top-1/2 text-muted-foreground -translate-y-1/2" />
    </div>
  );
};
