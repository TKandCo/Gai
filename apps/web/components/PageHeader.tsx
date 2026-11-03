import Link from "next/link";

export function PageHeader({
  title,
  subtitle,
  right,
  back,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      {back && (
        <Link href={back.href} className="mb-2 inline-flex h-10 items-center gap-1 text-sm font-medium text-accent">
          ← {back.label}
        </Link>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
