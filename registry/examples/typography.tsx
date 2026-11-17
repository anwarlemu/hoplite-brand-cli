import {
  TypographyAccent,
  TypographyBlockquote,
  TypographyEyebrow,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographyProse,
  TypographyTable,
} from "@/components/ui/typography";

export function Preview() {
  return (
    <div className="grid max-w-3xl gap-6">
      <TypographyEyebrow>Agents</TypographyEyebrow>
      <TypographyH1>
        A workstation for an army of <TypographyAccent>agents</TypographyAccent>
      </TypographyH1>
      <TypographyLead>Run coding agents side by side, each in its own sandbox, and merge what passes.</TypographyLead>
    </div>
  );
}

export function Headings() {
  return (
    <div className="grid gap-6">
      <TypographyH1>Heading one, 56px</TypographyH1>
      <TypographyH2>Heading two, 44px</TypographyH2>
      <TypographyH3>Heading three, 32px</TypographyH3>
      <TypographyH4>Heading four, 24px</TypographyH4>
      <TypographyMuted>Updated Oct 28 by the platform team</TypographyMuted>
    </div>
  );
}

export function Text() {
  return (
    <div className="max-w-2xl">
      <TypographyP>
        Each thread runs in a fresh sandbox with your repository checked out. Set the image with <TypographyInlineCode>hoplite.toml</TypographyInlineCode> and every agent starts from the same place.
      </TypographyP>
      <TypographyBlockquote>Take the issue affecting the most users, reproduce it with a failing test, fix it, and open a pull request.</TypographyBlockquote>
      <TypographyList>
        <li>A workspace with your repository connected</li>
        <li>Setup that runs green in the sandbox</li>
        <li>A Sentry project with alerts turned on</li>
      </TypographyList>
      <TypographyList ordered>
        <li>Create the automation</li>
        <li>Pick the trigger and the repository</li>
        <li>Write the instructions the agent follows</li>
      </TypographyList>
      <TypographyTable>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Sessions</th>
            <th>Sandbox</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Free</td>
            <td>5</td>
            <td>2 vCPU, 8 GiB</td>
          </tr>
          <tr>
            <td>Team</td>
            <td>20 per seat</td>
            <td>8 vCPU, 32 GiB</td>
          </tr>
        </tbody>
      </TypographyTable>
    </div>
  );
}

export function Prose() {
  return (
    <TypographyProse className="max-w-2xl">
      <p>Most alerts sit in a queue until someone has time. An automation can start the fix the moment the issue appears.</p>
      <h2>Set up the trigger</h2>
      <p>
        Open Automations, choose <code>Sentry issue created</code>, and pick the repository the agent should work in. <a href="#docs">Read the setup guide</a> for the permissions it needs.
      </p>
      <blockquote>
        <p>Look at unresolved issues that first appeared in the last hour. Skip anything already linked to an open pull request.</p>
      </blockquote>
      <h3>What the agent does</h3>
      <p>It reproduces the issue with a failing test, fixes it, and opens a pull request only when <strong>every check passes</strong>.</p>
    </TypographyProse>
  );
}
