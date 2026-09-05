import DashboardLayout from '@/components/layout/DashboardLayout'

export default function AboutPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            About StockFlow
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            A modern inventory management system built with Next.js.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold text-white">
              What is StockFlow?
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              StockFlow helps businesses manage products, categories,
              suppliers, stock levels, and inventory movements from one
              centralized dashboard.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold text-white">
              Built with Next.js
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              StockFlow uses the Next.js App Router, Server Components,
              Client Components, API Route Handlers, MongoDB, Cloudinary,
              and optimized images.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold text-white">
              Rendering Strategies
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              The application demonstrates Server-Side Rendering,
              Static Site Generation, and Incremental Static Regeneration
              using Next.js.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}