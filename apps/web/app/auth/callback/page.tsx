"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

function Callback() {
  const router = useRouter();
  const params = useSearchParams();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const code = params.get("code");
    const sb = getSupabase();
    if (!code || !sb) {
      setFailed(true);
      return;
    }
    sb.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) setFailed(true);
      else router.replace("/");
    });
  }, [params, router]);

  return (
    <main className="px-4 pt-16 text-center text-sm">
      {failed ? "Link đăng nhập không hợp lệ hoặc đã hết hạn. Hãy thử lại từ trang Đăng nhập." : "Đang đăng nhập..."}
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <Callback />
    </Suspense>
  );
}
