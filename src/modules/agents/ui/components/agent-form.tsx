"use client";

import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agentsSchema } from "../../schemas";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GenerateAvatar } from "@/components/generate-avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialsValues?: AgentGetOne;
}

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialsValues,
}: AgentFormProps) => {
  // Hooks
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createAgents = useMutation(
    trpc.agents.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);

        // TODO: if error is FOBIDDEN redirect to /upgrade
      },
      onSuccess: async () => {
        // prefetch data di page
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());
        if (initialsValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({
              id: initialsValues.id,
            })
          );
        }
        onSuccess?.();
      },
    })
  );

  const form = useForm<z.infer<typeof agentsSchema>>({
    resolver: zodResolver(agentsSchema),
    defaultValues: {
      name: initialsValues?.name ?? "",
      instruction: initialsValues?.instruction ?? "",
    },
  });

  const isEdit = !!initialsValues;
  const isPending = createAgents.isPending;

  const onSubmit = (values: z.infer<typeof agentsSchema>) => {
    if (isEdit) {
      console.log("TODO: create a update agents");
    } else {
      createAgents.mutate(values)
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <GenerateAvatar
          seed={form.watch("name")}
          variant="botttsNeutral"
          className="border size-16"
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Example: Math tutor"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="instruction"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instruction</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="You are a helful math assistant that can answer question and help with assignment"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          {onCancel && (
            <Button variant={"outline"} type="button" disabled={isPending}>
              cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
