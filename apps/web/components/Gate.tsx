"use client";

import { useProfiles } from "@/lib/profiles";
import { Onboarding } from "./Onboarding";

/** Lần đầu mở app (chưa có hồ sơ nào): hiện màn chào mừng thay cho nội dung. */
export function Gate({ children }: { children: React.ReactNode }) {
  const { ready, active } = useProfiles();
  if (ready && !active) return <Onboarding />;
  return <>{children}</>;
}
