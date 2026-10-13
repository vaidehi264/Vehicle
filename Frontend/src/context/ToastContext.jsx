import React, { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${
                toast.type === "success"
                  ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50"
                  : toast.type === "error"
                  ? "bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-950/50"
                  : "bg-slate-900/90 border-orange-500/40 text-slate-100 shadow-black/50"
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === "success" && <FaCheckCircle className="text-emerald-400 shrink-0 w-5 h-5" />}
                {toast.type === "error" && <FaExclamationCircle className="text-rose-400 shrink-0 w-5 h-5" />}
                {toast.type === "info" && <FaInfoCircle className="text-orange-400 shrink-0 w-5 h-5" />}
                <p className="text-sm font-medium leading-snug">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

