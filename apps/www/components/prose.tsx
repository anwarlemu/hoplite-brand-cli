// Inline code in docs text: Kode Mono in the ink, tracked 4 percent, kept whole across a line break.
export function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="font-code text-body-sm tracking-code text-fg [overflow-wrap:anywhere]">{children}</code>;
}

// Docs text from the registry's frontmatter: `backticked` names become inline code.
export function Prose({ text }: { text: string }) {
  return <>{Array.from(text.matchAll(/`([^`]+)`|([^`]+|`)/g), (match) => (match[1] !== undefined ? <InlineCode key={match.index}>{match[1]}</InlineCode> : match[0]))}</>;
}
