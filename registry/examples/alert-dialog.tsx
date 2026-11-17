"use client";

import { WarningIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DeleteSandbox({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <AlertDialog defaultOpen={defaultOpen}>
      <AlertDialogTrigger render={<Button variant="outline" />}>Delete sandbox</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this sandbox?</AlertDialogTitle>
          <AlertDialogDescription>The acme-web sandbox and its uncommitted changes are removed. Threads that used it keep their history.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete sandbox</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function Preview() {
  return <DeleteSandbox />;
}

export function Open() {
  return (
    <div className="min-h-96">
      <DeleteSandbox defaultOpen />
    </div>
  );
}

export function Small() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>Leave the team</AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <WarningIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Leave Acme?</AlertDialogTitle>
          <AlertDialogDescription>You lose access to its threads, repositories and automations. Your seat goes back to the plan.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay</AlertDialogCancel>
          <AlertDialogAction>Leave team</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
