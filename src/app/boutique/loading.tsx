export default function Loading() {
  return (
    <div className="animate-pulse bg-white pb-28">
      <div className="mx-auto mt-5 h-4 w-20 rounded bg-[#f0f0f0]" />
      <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-8 px-3 sm:px-4 lg:grid-cols-4 lg:px-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square bg-[#f5f5f5]" />
            <div className="mt-3 h-4 w-full rounded bg-[#f0f0f0]" />
            <div className="mt-2 h-3 w-24 rounded bg-[#f0f0f0]" />
            <div className="mt-2 h-3 w-16 rounded bg-[#f0f0f0]" />
          </div>
        ))}
      </div>
    </div>
  );
}
