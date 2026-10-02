import { BadgeCheck, Laptop, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function Hero() {
  const [showPhoto, setShowPhoto] = useState(true)

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue/15 bg-blue/5 px-3 py-1 text-xs font-semibold tracking-wide text-blue">
            <Sparkles className="h-3.5 w-3.5" />
            30-Day Skills Programs
          </div>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight text-ink sm:text-6xl">
            Learn Skills.
            <span className="block bg-gradient-to-r from-blue via-violet to-cyan bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Practical 30-day skills programs designed to help you learn, build real-world projects, earn
            certifications, and move confidently toward your career or freelancing goals.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/courses">Explore Courses</Button>
            <Button to="/journey" variant="secondary">
              How It Works
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
            <span className="rounded-full bg-mist px-4 py-2">Online + Offline</span>
            <span className="rounded-full bg-mist px-4 py-2">VXSA</span>
            <span className="rounded-full bg-mist px-4 py-2">Project-based learning</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-navy shadow-[0_30px_80px_rgba(7,17,31,0.25)]">
            {showPhoto ? (
              <img
                src="/brand/campus.jpg"
                alt="The VibeX Skills Academy atrium, with the glass X sculpture and VXSA mark"
                className="h-[520px] w-full object-cover"
                onError={() => setShowPhoto(false)}
              />
            ) : (
              <div className="flex h-[520px] items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(18,198,230,0.35),transparent_36%),radial-gradient(circle_at_75%_80%,rgba(109,61,245,0.5),transparent_42%),#07111f] p-8">
                <img src="/brand/logo.png" alt="" className="w-full max-w-md" />
              </div>
            )}
            <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
              30-Day Skills Programs
            </div>
            <div className="absolute right-4 bottom-4 rounded-full bg-navy/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              Online + Offline
            </div>
          </div>
          <div className="float-slow absolute -left-2 bottom-16 hidden w-52 rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur sm:block">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue/10 text-blue">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Certificate</p>
                <p className="text-xs text-muted">Validate the skill you trained</p>
              </div>
            </div>
          </div>
          <div className="float-slower absolute -right-2 top-24 hidden w-48 rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur md:block">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet/10 text-violet">
                <Laptop className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Live project</p>
                <p className="text-xs text-muted">Build work you can show</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-8 hidden items-center gap-2 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white sm:inline-flex">
            <ShieldCheck className="h-4 w-4 text-cyan" />
            Mentorship included
          </div>
        </div>
      </div>
    </section>
  )
}
