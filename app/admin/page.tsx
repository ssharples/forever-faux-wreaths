"use client";

import Link from "next/link";
import {
  Package,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  PoundSterling,
  Clock,
  Eye,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { timeAgo } from "@/lib/format-date";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  "in-progress": "bg-sage-100 text-sage-700",
  "in-discussion": "bg-purple-100 text-purple-700",
  dispatched: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  collected: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
};

export default function AdminDashboard() {
  const orders = useQuery(api.orders.list, {});
  const products = useQuery(api.products.list, {});
  const enquiries = useQuery(api.bespokeEnquiries.list, {});

  const isLoading = orders === undefined || products === undefined || enquiries === undefined;

  const totalRevenue = orders?.reduce((sum, o) => sum + o.total, 0) ?? 0;
  const orderCount = orders?.length ?? 0;
  const activeProducts = products?.filter(p => p.status === "active").length ?? 0;
  const newEnquiries = enquiries?.filter(e => e.status === "new").length ?? 0;

  const computedStats = [
    {
      name: "Total Revenue",
      value: `£${totalRevenue.toFixed(2)}`,
      icon: PoundSterling,
    },
    {
      name: "Total Orders",
      value: String(orderCount),
      icon: ShoppingBag,
    },
    {
      name: "Active Products",
      value: String(activeProducts),
      icon: Package,
    },
    {
      name: "New Enquiries",
      value: String(newEnquiries),
      icon: MessageSquare,
    },
  ];

  const pendingCount = orders?.filter(o => o.status === "pending" || o.status === "processing").length ?? 0;

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
          <p className="text-charcoal-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-charcoal-700 mb-2">Dashboard</h1>
        <p className="text-charcoal-500">
          Welcome back! Here&apos;s an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {computedStats.map((stat) => (
          <Card key={stat.name} className="p-6 border-cream-300 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-charcoal-500 mb-1">{stat.name}</p>
                <p className="text-2xl font-display text-charcoal-700">
                  {stat.value}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-sage-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="border-cream-300 bg-white">
            <div className="p-6 border-b border-cream-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-sage-600" />
                  <h2 className="text-lg font-medium text-charcoal-700">
                    Recent Orders
                  </h2>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/orders">View All</Link>
                </Button>
              </div>
            </div>
            <div className="divide-y divide-cream-200">
              {orders?.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="p-4 flex items-center justify-between hover:bg-cream-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-sage-600">
                        {order.customerName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-700">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-charcoal-500">
                        {order.customerName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-charcoal-700">
                        £{order.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-charcoal-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-700"}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
              {orders?.length === 0 && (
                <div className="p-8 text-center text-charcoal-400">
                  No orders yet
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Enquiries */}
        <div className="lg:col-span-1">
          <Card className="border-cream-300 bg-white">
            <div className="p-6 border-b border-cream-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-sage-600" />
                  <h2 className="text-lg font-medium text-charcoal-700">
                    Bespoke Enquiries
                  </h2>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/enquiries">View All</Link>
                </Button>
              </div>
            </div>
            <div className="divide-y divide-cream-200">
              {enquiries?.slice(0, 3).map((enquiry) => (
                <div key={enquiry._id} className="p-4 hover:bg-cream-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-charcoal-700">
                        {enquiry.name}
                      </p>
                      <p className="text-sm text-charcoal-500">
                        {enquiry.arrangementType}
                      </p>
                    </div>
                    <Badge className={statusColors[enquiry.status] || "bg-gray-100 text-gray-700"}>
                      {enquiry.status === "in-progress"
                        ? "In Progress"
                        : enquiry.status === "in-discussion"
                          ? "In Discussion"
                          : enquiry.status.charAt(0).toUpperCase() +
                            enquiry.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-xs text-charcoal-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeAgo(enquiry.createdAt)}
                  </p>
                </div>
              ))}
              {enquiries?.length === 0 && (
                <div className="p-8 text-center text-charcoal-400">
                  No enquiries yet
                </div>
              )}
            </div>
            <div className="p-4 border-t border-cream-200">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/admin/enquiries?status=new">
                  <Eye className="h-4 w-4 mr-2" />
                  View New Enquiries
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-charcoal-700 mb-4">
          Quick Actions
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            asChild
            variant="outline"
            className="h-auto py-4 justify-start border-cream-300 hover:bg-sage-50"
          >
            <Link href="/admin/products/new">
              <Package className="h-5 w-5 mr-3 text-sage-600" />
              <div className="text-left">
                <p className="font-medium">Add Product</p>
                <p className="text-xs text-charcoal-400">Create new listing</p>
              </div>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto py-4 justify-start border-cream-300 hover:bg-sage-50"
          >
            <Link href="/admin/orders?status=processing">
              <ShoppingBag className="h-5 w-5 mr-3 text-sage-600" />
              <div className="text-left">
                <p className="font-medium">Process Orders</p>
                <p className="text-xs text-charcoal-400">{pendingCount} pending</p>
              </div>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto py-4 justify-start border-cream-300 hover:bg-sage-50"
          >
            <Link href="/admin/gallery/upload">
              <ImageIcon className="h-5 w-5 mr-3 text-sage-600" />
              <div className="text-left">
                <p className="font-medium">Upload Images</p>
                <p className="text-xs text-charcoal-400">Add to gallery</p>
              </div>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto py-4 justify-start border-cream-300 hover:bg-sage-50"
          >
            <Link href="/admin/settings">
              <TrendingUp className="h-5 w-5 mr-3 text-sage-600" />
              <div className="text-left">
                <p className="font-medium">View Analytics</p>
                <p className="text-xs text-charcoal-400">Site performance</p>
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
