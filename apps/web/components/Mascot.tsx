/** Gai 🦉 – người dẫn đường, nói bằng bong bóng thoại. */
export function Mascot({ children, size = "md" }: { children: React.ReactNode; size?: "sm" | "md" | "lg" }) {
  const emoji = size === "lg" ? "text-6xl" : size === "md" ? "text-4xl" : "text-3xl";
  return (
    <div className="flex items-end gap-3">
      <span className={`${emoji} shrink-0 leading-none`} aria-hidden>
        🦉
      </span>
      <div className="relative flex-1 rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3 text-[0.95rem] leading-relaxed shadow-sm">
        {children}
      </div>
    </div>
  );
}
