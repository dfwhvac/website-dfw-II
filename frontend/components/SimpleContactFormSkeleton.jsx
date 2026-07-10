/**
 * Placeholder while SimpleContactFormClient loads the contact form chunk.
 */
export default function SimpleContactFormSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading contact form">
      <div className="mb-6 space-y-2">
        <div className="h-8 w-2/3 max-w-sm rounded bg-gray-200" />
        <div className="h-4 w-full max-w-md rounded bg-gray-100" />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 rounded bg-gray-100" />
          <div className="h-12 rounded bg-gray-100" />
        </div>
        <div className="h-12 rounded bg-gray-100" />
        <div className="h-12 rounded bg-gray-100" />
        <div className="h-28 rounded bg-gray-100" />
        <div className="h-12 rounded bg-gray-200" />
      </div>
    </div>
  )
}
