export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </header>
  );
}
