import { CheckCircleIcon, InfoIcon, WarningIcon, WarningOctagonIcon } from "@phosphor-icons/react/ssr";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function Preview() {
  return (
    <Alert className="max-w-xl">
      <InfoIcon />
      <AlertTitle>Sandboxes now restart from their last snapshot</AlertTitle>
      <AlertDescription>Threads that were running when a sandbox stopped pick up from the last finished step.</AlertDescription>
    </Alert>
  );
}

export function Variants() {
  return (
    <div className="grid max-w-xl gap-4">
      <Alert variant="destructive">
        <WarningOctagonIcon />
        <AlertTitle>The deploy check failed</AlertTitle>
        <AlertDescription>e2e: checkout timed out after 10 minutes on pull request #482. The agent has paused.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircleIcon />
        <AlertTitle>Repository connected</AlertTitle>
        <AlertDescription>acme/storefront is ready. Setup ran green in 2 minutes.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <WarningIcon />
        <AlertTitle>You have used 84 percent of this month's usage</AlertTitle>
        <AlertDescription>Runs will draw on prepaid credits once the allowance is used up.</AlertDescription>
      </Alert>
    </div>
  );
}

export function WithAction() {
  return (
    <Alert className="max-w-xl">
      <InfoIcon />
      <AlertTitle>Two seats are unassigned</AlertTitle>
      <AlertDescription>Invite teammates or remove the seats before the next billing date.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Manage seats
        </Button>
      </AlertAction>
    </Alert>
  );
}

export function TitleOnly() {
  return (
    <Alert className="max-w-xl">
      <AlertTitle>Automations are paused while the workspace is in read-only mode.</AlertTitle>
    </Alert>
  );
}
