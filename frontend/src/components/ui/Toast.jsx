import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const typeConfig = {
  success: {
    iconBg: 'bg-success',
    Icon: CheckCircle,
  },
  error: {
    iconBg: 'bg-danger',
    Icon: XCircle,
  },
  info: {
    iconBg: 'bg-primary',
    Icon: Info,
  },
};

/**
 * Individual toast notification.
 * Props:
 *   toast: { id, message, type, duration }
 *   onRemove: (id) => void
 */
export default function Toast({ toast, onRemove }) {
  const { id, message, type = 'info' } = toast;
  const config = typeConfig[type] ?? typeConfig.info;
  const { Icon, iconBg } = config;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-3 w-80 bg-white border border-border rounded-xl shadow-large px-4 py-3"
      role="alert"
      aria-live="polite"
    >
      <span className={`flex-shrink-0 rounded-full p-1 text-white ${iconBg}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="flex-1 text-sm text-text-primary leading-snug pt-0.5">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
}
