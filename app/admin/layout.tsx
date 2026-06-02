"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  Image,
  Settings,
  Users,
  Menu,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { AdminLogo } from "@/components/admin/admin-logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Bespoke Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { name: "Memorial Leads", href: "/admin/memorial-leads", icon: ShieldCheck },
  { name: "Gallery", href: "/admin/gallery", icon: Image },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const { signOut } = useAuthActions();

  return (
    <div className={`flex flex-col h-full ${mobile ? "" : "w-64"}`}>
      {/* Logo */}
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <AdminLogo size="md" />
          <div>
            <p className="font-display text-lg text-charcoal-700">Admin</p>
            <p className="text-xs text-charcoal-400">Forever Faux Wreaths</p>
          </div>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sage-100 text-sage-700"
                  : "text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-100"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
          Back to Site
        </Link>
        <button
          onClick={() => void signOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-charcoal-500 hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useQuery(api.users.current);
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginRoute) return;
    if (currentUser === null) {
      router.replace("/admin/login");
    } else if (currentUser && currentUser.role !== "admin") {
      router.replace("/account");
    }
  }, [currentUser, isLoginRoute, router]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (currentUser === undefined) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <p className="text-charcoal-500">Loading admin…</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-charcoal-700">Redirecting to admin sign-in…</p>
          <p className="mt-2 text-sm text-charcoal-500">
            If nothing happens, open <Link href="/admin/login" className="underline underline-offset-4">/admin/login</Link>.
          </p>
        </div>
      </div>
    );
  }

  if (currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-charcoal-700">Redirecting to your account…</p>
          <p className="mt-2 text-sm text-charcoal-500">
            This area is only available to admin users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r border-cream-300">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-cream-300">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <AdminLogo size="sm" />
            <span className="font-display text-charcoal-700">Admin</span>
          </Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="min-h-[44px] min-w-[44px]"
                aria-label="Open admin navigation"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SheetTitle className="sr-only">Admin navigation</SheetTitle>
              <Sidebar mobile />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
