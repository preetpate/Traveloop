const categoryColors = {
  Sightseeing:    'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Food & Drink': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Adventure:      'bg-green-500/20 text-green-300 border-green-500/30',
  Culture:        'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Shopping:       'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Transport:      'bg-gray-500/20 text-gray-300 border-gray-500/30',
  Accommodation:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Other:          'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

const fallbackColor = 'bg-slate-500/20 text-slate-300 border-slate-500/30';

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
