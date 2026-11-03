import { Fragment } from "react";

/** Hiển thị văn bản có **in đậm** và xuống dòng (định dạng dùng trong nội dung bài học). */
export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const lines = text.split("\n");
  return (
    <div className={`space-y-2 leading-relaxed ${className}`}>
      {lines.map((line, i) => (
        <p key={i}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, k) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={k} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <Fragment key={k}>{part}</Fragment>
            ),
          )}
        </p>
      ))}
    </div>
  );
}
