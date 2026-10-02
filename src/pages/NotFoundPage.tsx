import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found | VibeX Skills Academy" description="This page is not part of VibeX Skills Academy." />
      <section className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-blue uppercase">404</p>
        <h1 className="mt-3 font-display text-4xl">That page is not on the campus map.</h1>
        <Link to="/" className="mt-6 inline-flex font-semibold text-blue">Back home</Link>
      </section>
    </>
  )
}
