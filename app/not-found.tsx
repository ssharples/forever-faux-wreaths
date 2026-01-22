import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-8xl font-display text-sage-300 mb-4">404</h1>
        <h2 className="text-2xl font-display text-charcoal-700 mb-3">
          Page not found
        </h2>
        <p className="text-charcoal-500 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been
          moved or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-sage-400 hover:bg-sage-500 text-white">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-sage-400 text-sage-600 hover:bg-sage-50"
          >
            <Link href="/shop">
              <Search className="h-4 w-4 mr-2" />
              Browse Shop
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
