import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from "@/components/ui/code-block";

const INSTALL = `brew install usehoplite/tap/hoplite
hoplite login
hoplite thread "Fix 500 on uploads over 10 MB" --repo notra/notra-api`;

const CONFIG = `// hoplite.config.ts
export default {
  sandbox: { size: "8 vCPU", memory: "32 GiB" },
  // Run the suite before opening a pull request
  verify: ["npm test"],
  autoMerge: true,
};`;

export function Preview() {
  return (
    <CodeBlock className="max-w-xl">
      <CodeBlockHeader>
        <CodeBlockTitle>Bash</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={INSTALL} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent code={INSTALL} language="bash" />
    </CodeBlock>
  );
}

export function LineNumbers() {
  return (
    <CodeBlock className="max-w-xl">
      <CodeBlockHeader>
        <CodeBlockTitle>TypeScript</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={CONFIG} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent code={CONFIG} language="ts" lineNumbers />
    </CodeBlock>
  );
}
