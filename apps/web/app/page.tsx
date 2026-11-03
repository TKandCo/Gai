import Link from "next/link";
import { AccountChip } from "@/components/AccountChip";

const SECTIONS = [
  {
    href: "/lab",
    title: "Phòng lab ma trận",
    body: "Dựng một tình huống 2 bên, chạm để chỉnh lợi ích, xem ngay cân bằng và giải thích từng bước.",
    ready: true,
  },
  {
    href: "/learn",
    title: "Lộ trình học",
    body: "Từ ôn lại toán, xác suất đến trò chơi tuần tự. Bài ngắn 3–7 phút, có bài tập tương tác.",
    ready: false,
  },
  {
    href: "/journal",
    title: "Nhật ký dự đoán",
    body: "Ghi dự đoán kèm xác suất, đối chiếu kết quả và đo xem tư duy của bạn có tốt lên không.",
    ready: false,
  },
];

export default function HomePage() {
  return (
    <main className="px-4">
      <header className="flex items-center justify-between pb-2 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <span className="text-sm font-semibold tracking-wide text-accent">GAI</span>
        <AccountChip />
      </header>

      <section className="pb-6 pt-4">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Nghĩ trước
          <br />
          đối phương một bước.
        </h1>
        <p className="mt-3 text-muted">
          Học lý thuyết trò chơi từng bước, rồi dùng nó để phân tích tin tức, đầu tư và quyết định kinh doanh.
        </p>
      </section>

      <ul className="space-y-3">
        {SECTIONS.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="block rounded-2xl border border-line bg-surface p-4 transition active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{s.title}</h2>
                {s.ready ? (
                  <span className="text-accent">→</span>
                ) : (
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">Sắp có</span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-xs text-muted">
        Nội dung mang tính giáo dục, không phải tư vấn đầu tư.
      </p>
    </main>
  );
}
