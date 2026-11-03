"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

/**
 * Đăng nhập không mật khẩu: nhập email → nhận email có link và mã 6 số.
 * Mã 6 số giúp đăng nhập ngay trong app đã cài trên điện thoại (link email thường mở ra trình duyệt khác).
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!supabaseConfigured) {
    return (
      <main className="px-4">
        <PageHeader title="Đăng nhập" />
        <p className="rounded-2xl bg-surface-2 p-4 text-sm">
          Tài khoản chưa được bật. Ứng dụng vẫn dùng được bình thường, dữ liệu lưu trên máy này. Hướng dẫn bật tài khoản
          nằm trong <code>docs/DEPLOY.md</code>.
        </p>
      </main>
    );
  }

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await getSupabase()!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setBusy(false);
    if (error) setError("Không gửi được email. Kiểm tra lại địa chỉ hoặc thử lại sau ít phút.");
    else setStage("code");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await getSupabase()!.auth.verifyOtp({ email, token: code.trim(), type: "email" });
    setBusy(false);
    if (error) setError("Mã không đúng hoặc đã hết hạn.");
    else router.replace("/");
  };

  return (
    <main className="px-4">
      <PageHeader title="Đăng nhập" subtitle="Không cần mật khẩu. Đăng nhập để đồng bộ tiến độ giữa các thiết bị." />
      {stage === "email" ? (
        <form onSubmit={sendEmail} className="space-y-3">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@cua-ban.com"
            className="h-12 w-full rounded-xl border border-line bg-surface px-4 outline-none focus:border-accent"
          />
          <button disabled={busy} className="h-12 w-full rounded-xl bg-accent font-semibold text-accent-ink disabled:opacity-60">
            {busy ? "Đang gửi..." : "Gửi mã đăng nhập"}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-3">
          <p className="text-sm">
            Đã gửi email tới <b>{email}</b>. Bấm link trong email, hoặc nhập mã 6 số:
          </p>
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-center text-xl tracking-[0.4em] outline-none focus:border-accent"
          />
          <button disabled={busy || code.trim().length < 6} className="h-12 w-full rounded-xl bg-accent font-semibold text-accent-ink disabled:opacity-60">
            {busy ? "Đang kiểm tra..." : "Xác nhận"}
          </button>
          <button type="button" onClick={() => setStage("email")} className="w-full text-sm text-muted">
            Dùng email khác
          </button>
        </form>
      )}
      {error && <p className="mt-3 text-sm text-bad">{error}</p>}
    </main>
  );
}
