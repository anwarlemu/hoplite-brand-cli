"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Values = { repository: string; task: string; autoMerge: boolean };

export function Preview() {
  const form = useForm<Values>({ defaultValues: { repository: "", task: "", autoMerge: false } });
  const [sent, setSent] = React.useState<Values | null>(null);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(setSent)} className="grid w-full max-w-md gap-6" noValidate>
        <FormField
          control={form.control}
          name="repository"
          rules={{ required: "Choose a repository.", pattern: { value: /^[\w.-]+\/[\w.-]+$/, message: "Use the owner/name form, like acme/payments-api." } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository</FormLabel>
              <FormControl>
                <Input placeholder="acme/payments-api" {...field} />
              </FormControl>
              <FormDescription>Agents clone it into a fresh sandbox.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="task"
          rules={{ required: "Describe the task." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task</FormLabel>
              <FormControl>
                <Textarea placeholder="Upgrade to Node 22 and fix failing tests" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="autoMerge"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Merge when checks pass</FormLabel>
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
          <Button type="submit">Start thread</Button>
          {sent && <span className="text-body-sm text-fg-muted">Started on {sent.repository}</span>}
        </div>
      </form>
    </Form>
  );
}

export function Errors() {
  const form = useForm<Values>({ defaultValues: { repository: "payments api", task: "", autoMerge: false } });
  React.useEffect(() => {
    form.setError("repository", { message: "Use the owner/name form, like acme/payments-api." });
  }, [form]);
  return (
    <Form {...form}>
      <form className="grid w-full max-w-md gap-6" noValidate>
        <FormField
          control={form.control}
          name="repository"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
