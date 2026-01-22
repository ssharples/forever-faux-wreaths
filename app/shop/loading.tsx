import { Header, Footer } from "@/components/layout";

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-cream-200 rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-cream-200 rounded w-3/4" />
        <div className="h-4 bg-cream-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function ShopLoading() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-cream-100">
        <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-12">
          <div className="container-wide">
            <div className="h-10 bg-cream-200 rounded w-48 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-cream-200 rounded w-96 mx-auto animate-pulse" />
          </div>
        </section>
        <section className="py-8">
          <div className="container-wide">
            <div className="flex gap-8">
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24 bg-white rounded-lg border border-cream-300 p-6">
                  <div className="h-6 bg-cream-200 rounded w-24 mb-4 animate-pulse" />
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 bg-cream-200 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              </aside>
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
