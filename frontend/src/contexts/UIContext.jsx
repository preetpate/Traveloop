import { createContext, useState, useCallback, useRef } from 'react';

export const UIContext = createContext(null);

const DEFAULT_TOAST_DURATION = 4000;

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null); // { component, props }
  const toastTimers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (toastTimers.current[id]) {
      clearTimeout(toastTimers.current[id]);
      delete toastTimers.current[id];
    }
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = DEFAULT_TOAST_DURATION) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      toastTimers.current[id] = setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const openModal = useCallback((component, props = {}) => {
    setModal({ component, props });
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <UIContext.Provider value={{ toasts, addToast, removeToast, openModal, closeModal, modal }}>
      {children}
    </UIContext.Provider>
  );
}
