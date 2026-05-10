import { useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import { UIContext } from '../../contexts/UIContext';
import Toast from './Toast';

/**
 * Renders active toasts from UIContext.
 * Fixed position at the bottom-right of the viewport.
 * Uses Framer Motion AnimatePresence for enter/exit animations.
 */
export default function ToastContainer() {
  const { toasts, removeToast } = useContext(UIContext);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
