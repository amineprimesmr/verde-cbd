export default function Loading() {
  return (
    <div className="animate-pulse bg-white pb-28">
      <div className="aspect-square bg-[#f4f4f4]" />
      <div className="space-y-3 px-4 py-6">
        <div className="h-4 w-32 rounded bg-[#eee]" />
        <div className="h-8 w-3/4 rounded bg-[#eee]" />
        <div className="h-16 w-full rounded bg-[#eee]" />
      </div>
      <div className="grid grid-cols-2 border-y border-[#eee]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-[#fafafa]" />
        ))}
      </div>
    </div>
  );
}
