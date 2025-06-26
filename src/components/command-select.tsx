"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "./ui/command";
import { ChevronsUpDownIcon } from "lucide-react";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: React.ReactNode;
  }>;
  onSelect: (values: string) => void;
  onSearch?: (values: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: string;
  className?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an options",
  isSearchable,
  className,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOptions = options.find((option) => option.value === value);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "h-9 justify-between font-normal px-2",
          !selectedOptions && "text-muted-foreground",
          className
        )}
        variant={"outline"}
        type="button"
      >
        <div>{selectedOptions?.children ?? placeholder}</div>
        <ChevronsUpDownIcon />
      </Button>
      <CommandResponsiveDialog
        shouldFilter={!onSearch}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No Option Found
            </span>
          </CommandEmpty>
          {options.map((options) => (
            <CommandItem
              key={options.id}
              onSelect={() => {
                onSelect(options.id);
                setIsOpen(false);
              }}
            >
              {options.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};
