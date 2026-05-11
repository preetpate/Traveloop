const categoryColors = {
  Sightseeing:    'bg-blue-500/30 text-blue-300 border-blue-500/50',
  'Food & Drink': 'bg-orange-500/30 text-orange-300 border-orange-500/50',
  Adventure:      'bg-green-500/30 text-green-300 border-green-500/50',
  Culture:        'bg-purple-500/30 text-purple-300 border-purple-500/50',
  Shopping:       'bg-pink-500/30 text-pink-300 border-pink-500/50',
  Transport:      'bg-gray-500/30 text-gray-300 border-gray-500/50',
  Accommodation:  'bg-yellow-500/30 text-yellow-300 border-yellow-500/50',
  Other:          'bg-slate-500/30 text-slate-300 border-slate-500/50',
};

const fallbackColor = 'bg-slate-500/30 text-slate-300 border-slate-500/50';

/**
 * Category color badge.
 * Props:
 *   category: string — activity category name
 *   className: string — additional Tailwind classes
 */
export default function Badge({ category, className = '' }) {
  const colorClasses = categoryColors[category] ?? fallbackColor;

  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colorClasses,
        className,
      ].join(' ')}
    >
      {category}
    </span>
  );
}
