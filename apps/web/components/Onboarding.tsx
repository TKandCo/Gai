"use client";

import { useState } from "react";
import { useProfiles } from "@/lib/profiles";
import { Mascot } from "./Mascot";
import { ProfileForm } from "./ProfileForm";
import { RichText } from "./RichText";

const SLIDES = [
  {
    big: "👋",
    title: "Xin chào! Mình là Gai 🦉",
    body: "Mình sẽ giúp bạn học cách **đoán trước người khác sẽ làm gì**, để ra quyết định khôn ngoan hơn.",
  },
  {
    big: "✊✌️✋",
    title: "Học qua trò chơi",
    body: "Oẳn tù tì, chia kẹo, sút phạt đền… Mỗi trò chơi giấu một bí mật về cách con người suy nghĩ.",
  },
  {
    big: "⏱️",
    title: "Mỗi ngày 10 phút",
    body: "Bài học ngắn, có câu đố. Làm đúng thì mở bài mới. Sai cũng không sao, Gai sẽ giải thích.",
  },
];

export function Onboarding() {
  const { addProfile } = useProfiles();
  const [step, setStep] = useState(0);
  const isForm = step >= SLIDES.length;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-8 pt-[max(2rem,env(safe-area-inset-top))]">
      <div className="mb-6 flex justify-center gap-2" aria-hidden>
        {[...SLIDES, null].map((_, i) => (
          <span key={i} className={`h-2 rounded-full transition-all ${i === step ? "w-6 bg-accent" : "w-2 bg-line"}`} />
        ))}
      </div>

      {!isForm ? (
        <div key={step} className="animate-pop flex flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-6 text-7xl" aria-hidden>
              {SLIDES[step].big}
            </div>
            <h1 className="mb-3 text-2xl font-bold">{SLIDES[step].title}</h1>
            <RichText text={SLIDES[step].body} className="text-lg text-muted" />
          </div>
          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="h-14 flex-1 rounded-2xl border-2 border-line font-semibold">
                Quay lại
              </button>
            )}
            <button onClick={() => setStep(step + 1)} className="h-14 flex-[2] rounded-2xl bg-accent text-lg font-bold text-accent-ink">
              Tiếp tục
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-pop space-y-6">
          <Mascot>Trước khi bắt đầu, cho Gai biết một chút về bạn nhé! Mỗi người trong nhà nên có một hồ sơ riêng.</Mascot>
          <ProfileForm onSubmit={addProfile} />
          <p className="text-center text-xs text-muted">Thông tin chỉ lưu trên máy này. Không cần email.</p>
        </div>
      )}
    </main>
  );
}
