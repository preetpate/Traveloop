import { motion } from 'framer-motion';

/**
 * Animated progress bar.
 * Props:
 *   value: number (0–100)
 *   color: string — Tailwind bg class (default: 'bg-primary')
 *   showLabel: boolean — show percentage label
 *   className: string — additional classes for the wrapper
 */
export default function ProgressBar({
  value = 0,
  color = 'bg-primary',
  showLabel = false,
  className = '',
}) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={['flex items-center gap-3', className].join(' ')}>
      <div
        className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${clamped}% complete`}
      >
        <motion.div
          className={['h-full rounded-full', color].join(' ')}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-text-secondary tabular-nums w-9 text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}
