"use client";

import { Icon } from "./Icons";
import { useStore } from "@/lib/store";

export function Toast() {
  const { toasts } = useStore();
  return (
    <div className="toast-wrap" id="toast-wrap" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast${t.leaving ? " is-leaving" : ""}`}>
          <Icon name="check" />
          {t.msg}
        </div>
      ))}
    </div>
  );
}
