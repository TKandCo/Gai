import Link from "next/link";

export default function NotFound() {
  return (
    <main className="space-y-6 px-4 pt-16 text-center">
      <div className="text-6xl">🦉❓</div>
      <h1 className="text-2xl font-bold">Gai không tìm thấy trang này</h1>
      <p className="text-muted">Có thể đường dẫn đã thay đổi. Mình quay về trang chủ nhé.</p>
      <Link href="/" className="inline-flex h-12 items-center rounded-2xl bg-accent px-6 font-bold text-accent-ink">
        Về trang chủ
      </Link>
    </main>
  );
}
