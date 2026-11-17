import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function Preview() {
  return (
    <RadioGroup defaultValue="review" aria-label="When an agent finishes">
      <Label>
        <RadioGroupItem value="review" />
        Open a pull request for review
      </Label>
      <Label>
        <RadioGroupItem value="merge" />
        Merge when checks pass
      </Label>
      <Label>
        <RadioGroupItem value="draft" />
        Keep the branch as a draft
      </Label>
    </RadioGroup>
  );
}

export function States() {
  return (
    <div className="grid gap-6">
      <RadioGroup defaultValue="a" aria-label="Enabled">
        <Label>
          <RadioGroupItem value="a" />
          Chosen
        </Label>
        <Label>
          <RadioGroupItem value="b" />
          Not chosen
        </Label>
        <Label>
          <RadioGroupItem value="c" aria-invalid />
          Invalid
        </Label>
      </RadioGroup>
      <RadioGroup defaultValue="a" disabled aria-label="Disabled">
        <Label>
          <RadioGroupItem value="a" />
          Disabled, chosen
        </Label>
        <Label>
          <RadioGroupItem value="b" />
          Disabled
        </Label>
      </RadioGroup>
    </div>
  );
}

export function Inline() {
  return (
    <RadioGroup defaultValue="monthly" aria-label="Billing" className="flex gap-6">
      <Label>
        <RadioGroupItem value="monthly" />
        Monthly
      </Label>
      <Label>
        <RadioGroupItem value="yearly" />
        Yearly
      </Label>
    </RadioGroup>
  );
}
