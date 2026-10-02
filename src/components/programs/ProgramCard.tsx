import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProgramIcon } from '@/lib/icons'
import { formatNaira } from '@/lib/format'
import type { Category } from '@/types/database'

export function ProgramCard({ program }: { program: Category }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-line bg-white p-6 shadow-[0_16px_40px_rgba(7,17,31,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(31,107,255,0.12)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan via-blue to-violet" />
      <div className="flex items-start justify-between gap-4">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-blue">{program.code}</p>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mist text-blue">
          <ProgramIcon name={program.icon} className="h-5 w-5" />
        </span>
      </div>
      <h3 className="mt-6 font-display text-[1.65rem] leading-tight tracking-tight text-ink">{program.name}</h3>
      {program.subtitle ? <p className="mt-1 text-sm font-semibold text-violet">{program.subtitle}</p> : null}
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{program.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
        <span className="rounded-full bg-mist px-3 py-1">{program.duration_days} Days</span>
        <span className="rounded-full bg-mist px-3 py-1">{program.format_label}</span>
        {program.risk_notice ? (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">Risk education included</span>
        ) : null}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-xl text-ink">{formatNaira(program.price)}</p>
        <div className="flex items-center gap-3">
          <Link to={`/courses/${program.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-blue">
            View Program
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link to={`/enroll/${program.slug}`} className="rounded-full bg-navy px-3 py-2 text-sm font-semibold text-white">
            Enroll Now
          </Link>
        </div>
      </div>
    </article>
  )
}
