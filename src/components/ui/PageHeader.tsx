export function PageHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text: string
}) {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.22em] text-blue uppercase">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight text-ink sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{text}</p>
      </div>
    </header>
  )
}
