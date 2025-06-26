"use client";

import { useTRPC } from "@/trpc/client";
import { MeetingGetOne } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { meetingsSchema } from "../../schemas";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GenerateAvatar } from "@/components/generate-avatar";
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { NewAgentDialog } from "@/modules/agents/ui/components/agent-new-dialog";

interface MeetingsFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialsValues?: MeetingGetOne;
}

export const MeetingsForm = ({
  onSuccess,
  onCancel,
  initialsValues,
}: MeetingsFormProps) => {
  // Hooks
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [openNewAgentDialog, setNewAgentDialog] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        onSuccess?.(data.id);
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
        // TODO: if error is FOBIDDEN redirect to /upgrade
      },
      onSuccess: async () => {
        // prefetch data di page
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        if (initialsValues?.id) {
          // prefetch data one di page id agents
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({
              id: initialsValues.id,
            })
          );
        }
        onSuccess?.();
      },
    })
  );

  const form = useForm<z.infer<typeof meetingsSchema>>({
    resolver: zodResolver(meetingsSchema),
    defaultValues: {
      name: initialsValues?.name ?? "",
      agentId: initialsValues?.agentId ?? "",
    },
  });

  const isEdit = !!initialsValues;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsSchema>) => {
    if (initialsValues) {
      updateMeeting.mutate({ ...values, id: initialsValues.id });
    } else {
      console.log("will execute this", values);
      createMeeting.mutate({ ...values });
    }
  };

  return (
    <>
      <NewAgentDialog
        open={openNewAgentDialog}
        onOpenChange={setNewAgentDialog}
      />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Example: Math Consultation"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items ?? []).map((item) => ({
                      id: item.id,
                      value: item.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GenerateAvatar
                            seed={item.name}
                            variant="botttsNeutral"
                            className="border size-6"
                          />
                          <span>{item.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    value={field.value}
                    onSearch={setAgentSearch}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Not found what you're looking for?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setNewAgentDialog(true)}
                  >
                    Create new agent
                  </button>
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            {onCancel && (
              <Button
                variant={"outline"}
                onClick={onCancel}
                type="button"
                disabled={isPending}
              >
                cancel
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
