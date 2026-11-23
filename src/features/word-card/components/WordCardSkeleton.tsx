export function WordCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-card border-border bg-surface flex min-h-56 flex-col items-center justify-center gap-3 border p-5 shadow-sm motion-safe:animate-pulse"
    >
      <div className="bg-border rounded-control h-8 w-32" />
      <div className="bg-border h-6 w-14 rounded-full" />
    </div>
  );
}
