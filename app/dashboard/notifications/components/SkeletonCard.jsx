export default function SkeletonCard() {
  return (
    <div className="border-gray-low-soft flex animate-pulse items-start gap-4 rounded-xl border bg-white p-4">
      <div className="bg-gray-low-soft h-9 w-9 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="bg-gray-low-soft h-3.5 w-3/4 rounded" />
        <div className="bg-gray-low-soft h-3 w-1/3 rounded" />
      </div>
      <div className="bg-gray-low-soft h-5 w-14 rounded-full" />
    </div>
  );
}
