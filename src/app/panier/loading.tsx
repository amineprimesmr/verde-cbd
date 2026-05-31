export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-4 w-16 rounded bg-warm" />
      <div className="mt-3 h-10 w-48 rounded bg-warm" />
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-border p-4">
              <div className="h-28 w-28 rounded-xl bg-warm" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-2/3 rounded bg-warm" />
                <div className="h-4 w-1/3 rounded bg-warm" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-64 rounded-2xl border border-border bg-warm" />
      </div>
    </div>
  );
}
