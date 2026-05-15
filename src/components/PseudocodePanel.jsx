// Hand-rolled syntax coloring. We only color comments and a small set of
// keywords — anything richer is unnecessary for educational pseudocode and
// pulling in a highlighting library would be overkill.

const KEYWORDS = new Set([
  'for',
  'if',
  'else',
  'while',
  'return',
  'function',
  'do',
  'in',
  'continue',
  'break',
  'true',
  'false',
  'null',
  'and',
  'or',
  'not',
])

function tokenize(line) {
  const trimmed = line.trimStart()
  if (trimmed.startsWith('//')) {
    return [{ kind: 'comment', text: line }]
  }
  // Split on word boundaries so we can recolor keywords without touching
  // surrounding punctuation/whitespace.
  const parts = line.split(/(\b[A-Za-z_]+\b)/)
  return parts.map((p) => {
    if (KEYWORDS.has(p)) return { kind: 'kw', text: p }
    return { kind: 'plain', text: p }
  })
}

export default function PseudocodePanel({ code, label = 'Pseudocode' }) {
  const lines = code.split('\n')
  return (
    <div className="bg-surface p-5 h-full">
      <div className="font-mono text-[11px] uppercase tracking-wider text-muted mb-3">
        {label}
      </div>
      <pre className="font-mono text-[12px] leading-relaxed text-ink whitespace-pre-wrap break-words">
        {lines.map((line, li) => (
          <div key={li}>
            {tokenize(line).map((t, ti) => {
              if (t.kind === 'comment')
                return (
                  <span key={ti} className="text-muted italic">
                    {t.text}
                  </span>
                )
              if (t.kind === 'kw')
                return (
                  <span key={ti} className="text-accent">
                    {t.text}
                  </span>
                )
              return <span key={ti}>{t.text}</span>
            })}
            {/* keep blank lines visible */}
            {line === '' ? '\u00A0' : null}
          </div>
        ))}
      </pre>
    </div>
  )
}
