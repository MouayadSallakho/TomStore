import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import "../assets/styles/Toast.css";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const lastShownRef = useRef(new Map());
  const navigate = useNavigate();

  const showToast = useCallback(
    ({
      type = "success", // "success" | "info" | "warning" | "danger"
      title,
      message = "",
      actionLabel,
      actionRoute,
      duration = 2600,
      dedupeKey,
    }) => {
      if (!title) return;

      const key =
        dedupeKey ||
        `${type}:${actionRoute || ""}:${title}:${message}`.slice(0, 200);
      const now = Date.now();
      const last = lastShownRef.current.get(key);

      // prevent spam for same toast within 1s
      if (last && now - last < 1000) return;
      lastShownRef.current.set(key, now);

      const id = ++idCounter;
      const toast = {
        id,
        type,
        title,
        message,
        actionLabel,
        actionRoute,
      };

      setToasts((prev) => {
        const next = [...prev, toast];
        // keep only last 3 toasts
        if (next.length > 3) next.shift();
        return next;
      });

      if (duration > 0) {
        window.setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    [],
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleAction = useCallback(
    (toast) => {
      if (toast.actionRoute) {
        navigate(toast.actionRoute);
      }
      removeToast(toast.id);
    },
    [navigate, removeToast],
  );

  const value = { showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Global toast host */}
      <div className="cartToastHost" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`cartToast cartToast--${toast.type}`}
          >
            <div className="cartToastInner">
              <div className="cartToastText">
                <b>{toast.title}</b>
                {toast.message ? (
                  <span className="small"> {toast.message}</span>
                ) : null}
              </div>

              <div className="cartToastActions">
                {toast.actionLabel && toast.actionRoute && (
                  <button
                    type="button"
                    className="toastBtn"
                    onClick={() => handleAction(toast)}
                  >
                    {toast.actionLabel}
                  </button>
                )}

                <button
                  type="button"
                  className="toastX"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

