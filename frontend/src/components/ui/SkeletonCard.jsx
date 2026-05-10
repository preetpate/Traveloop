/**
 * Animated skeleton placeholder matching a typical trip card shape.
 * Uses Tailwind's animate-pulse for the loading animation.
 */
export default function SkeletonCard({ className = '' }) {
  return (
    <div
      className={[
        'bg-white/80 border border-border rounded-2xl shadow-medium overflow-hidden animate-pulse',
        className,
      ].join(' ')}
      aria-busy="true"
      aria-label="Loading content"
      role="status"
    >
      {/* Image area placeholder */}
      <div className="w-full h-44 bg-gray-200" />

      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Title line */}
        <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
        {/* Subtitle line */}
        <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
        {/* Extra detail line */}
        <div className="h-3 bg-gray-200 rounded-lg w-2/3" />

        {/* Badge + date row */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 bg-gray-200 rounded-full w-20" />
          <div className="h-3 bg-gray-200 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}
