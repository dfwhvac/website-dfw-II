/**
 * Placeholder shown while RequestServiceFormClient loads the LeadForm chunk.
 * Static markup only — keeps layout stable and lets the hero remain LCP on desktop.
 */
export default function LeadFormSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading service request form">
      <div className="mb-6 space-y-2">
        <div className="h-8 w-3/4 max-w-md rounded bg-gray-200" />
        <div className="h-4 w-full max-w-lg rounded bg-gray-100" />
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 rounded bg-gray-100" />
          <div className="h-12 rounded bg-gray-100" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 rounded bg-gray-100" />
          <div className="h-12 rounded bg-gray-100" />
        </div>
        <div className="h-12 rounded bg-gray-100" />
        <div className="h-12 rounded bg-gray-100" />
        <div className="h-24 rounded bg-gray-100" />
        <div className="h-12 rounded bg-gray-200" />
      </div>
    </div>
  )
}
