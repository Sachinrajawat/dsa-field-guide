export default function AlgorithmInfo({ meta }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2">
        About
      </div>
      <p className="font-sans text-sm text-ink leading-relaxed mb-5">
        {meta.description}
      </p>

      <div className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2">
        Complexity
      </div>
      <dl className="font-mono text-xs text-ink">
        <div className="flex justify-between border-b border-rule py-1">
          <dt className="text-muted">time</dt>
          <dd>{meta.time}</dd>
        </div>
        <div className="flex justify-between py-1">
          <dt className="text-muted">space</dt>
          <dd>{meta.space}</dd>
        </div>
      </dl>
    </div>
  )
}
