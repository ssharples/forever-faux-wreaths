export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-sage-200 border-t-sage-400 animate-spin" />
        <p className="text-charcoal-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
