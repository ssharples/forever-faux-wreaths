export default function AdminLoading() {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-cream-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-cream-200 rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-cream-200 rounded-lg" />
      </div>
    </div>
  );
}
