"use client";

import Link from "next/link";
import { LEVELS, nextLesson, ALL_LESSONS } from "@gai/learning";
import { useProfiles } from "@/lib/profiles";
import { useJournal } from "@/lib/journal";
import { today } from "@gai/learning";
import { Mascot } from "@/components/Mascot";
import { HelpButton } from "@/components/Help";
import { Badges } from "@/components/Badges";

const HELP = [
  { icon: "📚", text: "Bấm \"Học\" ở dưới cùng để học từng bài ngắn. Làm đúng câu đố sẽ mở bài mới." },
  { icon: "🧪", text: "\"Phòng lab\" là nơi tự tạo trò chơi: chạm vào ô để đổi số và xem điều gì xảy ra." },
  { icon: "🦉", text: "\"Hỏi Gai\": kể một chuyện khó chọn, Gai sẽ hỏi lại từng bước rồi mới đưa giải đáp." },
  { icon: "🔍", text: "\"Phân tích\" giúp bạn phân tích một chuyện thật (tin tức, chuyện ở lớp) theo từng bước." },
  { icon: "🔮", text: "\"Nhật ký\" để ghi dự đoán về tương lai, rồi xem mình đoán chuẩn đến đâu." },
  { icon: "👨‍👩‍👧", text: "Bấm vào hình đại diện ở góc trên để đổi người học hoặc thêm người trong nhà." },
];

export function HomeClient() {
  const { active, progress, isKid, ready } = useProfiles();
  const { items } = useJournal();
  const next = ready ? nextLesson(LEVELS, progress) : null;
  const passed = Object.values(progress.lessons).filter((l) => l.passed).length;
  const dueCount = items.filter((x) => x.outcome === null && x.due <= today()).length;
  const streak = progress.streak.last && progress.streak.last >= addDaysSafe(-1) ? progress.streak.count : 0;

  return (
    <main className="px-4">
      <header className="flex items-center justify-between pb-2 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Link href="/profile" className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3">
          <span className="text-2xl">{active?.avatar ?? "🙂"}</span>
          <span className="max-w-32 truncate text-sm font-semibold">{active?.name ?? "Hồ sơ"}</span>
        </Link>
        <HelpButton id="home" title="Chào mừng đến với GAI" steps={HELP} />
      </header>

      <section className="pb-5 pt-4">
        <h1 className="text-[1.9rem] font-bold leading-tight tracking-tight">
          {isKid ? (
            <>
              Chào {active?.name}! 👋
              <br />
              Hôm nay học gì nhỉ?
            </>
          ) : (
            <>
              Nghĩ trước
              <br />
              đối phương một bước.
            </>
          )}
        </h1>
      </section>

      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <Stat value={`${streak}🔥`} label="ngày liên tiếp" />
        <Stat value={`${passed}/${ALL_LESSONS.length}`} label="bài đã qua" />
        <Stat value={`${items.length}`} label="dự đoán" />
      </div>

      <div className="mb-4">
        <Badges compact />
      </div>

      {next ? (
        <Link href={`/learn/${next.id}`} className="mb-3 block rounded-3xl bg-accent p-5 text-accent-ink transition active:scale-[0.99]">
          <p className="text-sm opacity-90">{passed === 0 ? "Bắt đầu từ đây" : "Học tiếp"}</p>
          <p className="mt-1 text-xl font-bold leading-snug">
            {next.emoji} {next.title}
          </p>
          <p className="mt-1 text-sm opacity-90">
            {next.minutes} phút · {next.summary}
          </p>
        </Link>
      ) : (
        <div className="mb-3">
          <Mascot>Bạn đã học hết các bài hiện có! Vào Luyện tập để ôn lại nhé.</Mascot>
        </div>
      )}

      {dueCount > 0 && (
        <Link href="/journal" className="mb-3 flex items-center gap-3 rounded-2xl border-2 border-nash bg-nash-soft p-4">
          <span className="text-2xl">⏰</span>
          <span className="font-semibold">Có {dueCount} dự đoán đến lúc đối chiếu kết quả</span>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Tile href="/learn/practice" icon="🔁" title="Luyện tập" body="Ôn lại câu cũ, nhất là câu từng sai" />
        <Tile href="/lab" icon="🧪" title="Phòng lab" body="Tự tạo trò chơi và xem kết quả" />
        <Tile href="/journal" icon="🔮" title="Nhật ký" body="Đoán trước, đối chiếu sau" />
        <Tile href="/coach" icon="🦉" title="Hỏi Gai" body="Kể chuyện khó chọn, Gai hỏi lại từng bước" />
        <Tile href="/analyze" icon="🔍" title="Phân tích" body="Phân tích một chuyện thật, từng bước" />
        <Tile href="/learn" icon="🗺️" title="Lộ trình" body="Xem tất cả các bài học" />
      </div>

      <p className="mt-8 text-center text-xs text-muted">Nội dung mang tính giáo dục, không phải tư vấn đầu tư.</p>
    </main>
  );
}

function addDaysSafe(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return today(d);
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-2 py-3">
      <p className="text-xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function Tile({ href, icon, title, body }: { href: string; icon: string; title: string; body: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-line bg-surface p-4 transition active:scale-[0.98]">
      <div className="text-2xl">{icon}</div>
      <p className="mt-2 font-semibold">{title}</p>
      <p className="text-xs leading-snug text-muted">{body}</p>
    </Link>
  );
}
