"use client";

import Link from "next/link";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

export function AccountChip() {
  const { user, ready } = useUser();
  if (!supabaseConfigured || !ready) return null;
  if (!user)
    return (
      <Link href="/login" className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium">
        Đăng nhập
      </Link>
    );
  return (
    <button
      onClick={() => getSupabase()?.auth.signOut()}
      className="max-w-40 truncate rounded-full border border-line bg-surface px-3 py-1.5 text-xs"
      title="Bấm để đăng xuất"
    >
      {user.email} · Thoát
    </button>
  );
}
