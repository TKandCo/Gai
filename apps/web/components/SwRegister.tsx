"use client";

import { useEffect } from "react";

/** Đăng ký service worker (chỉ ở bản production, để khi phát triển không bị bộ nhớ đệm làm rối). */
export function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
