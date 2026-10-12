"use client";

import type { MouseEventHandler, ReactNode } from "react";

interface ModalProps {
  id: string;
  open: boolean;
  labelledBy?: string;
  role?: "dialog" | "alertdialog";
  className?: string;
  onClose: () => void;
  children: ReactNode;
}

/* Modal selalu terpasang (class `is-open` yang di-toggle) supaya transisi
   opacity/transform dari CSS asli tetap berjalan persis seperti versi HTML. */
export function Modal({ id, open, labelledBy, role = "dialog", className = "modal", onClose, children }: ModalProps) {
  const onBackdrop: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      id={id}
      className={`${className}${open ? " is-open" : ""}`}
      role={role}
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-hidden={!open}
      onMouseDown={onBackdrop}
    >
      {children}
    </div>
  );
}
