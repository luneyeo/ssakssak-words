export function WordCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-card border-border bg-surface flex min-h-50 flex-col justify-between border p-5 shadow-sm motion-safe:animate-pulse"
    >
      <div className="bg-border h-6 w-12 rounded-full" />
      <div className="bg-border rounded-control h-8 w-32" />
    </div>
  );
}
