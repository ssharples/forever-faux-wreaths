"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Package,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  PoundSterling,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  pending: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  "in-discussion": "bg-purple-100 text-purple-700",
  "in-progress": "bg-sage-100 text-sage-700",
  dispatched: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  collected: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  complete: "bg-green-100 text-green-700",
  accepted: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function StatsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-6 border-cream-300 bg-white animate-pulse">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-cream-200 rounded w-24" />
              <div className="h-8 bg-cream-200 rounded w-16" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-cream-200" />
          </div>
          <div className="mt-3 h-4 bg-cream-200 rounded w-32" />
        </Card>
      ))}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="divide-y divide-cream-200">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-cream-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-cream-200 rounded w-24" />
              <div className="h-3 bg-cream-200 rounded w-16" />
            </div>
            <div className="h-6 bg-cream-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EnquiriesSkeleton() {
  return (
    <div className="divide-y divide-cream-200">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 animate-pulse">
          <div className="space-y-2">
            <div className="h-4 bg-cream-200 rounded w-32" />
            <div className="h-3 bg-cream-200 rounded w-24" />
            <div className="h-3 bg-cream-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const orderStats = useQuery(api.orders.getStats);
  const recentOrders = useQuery(api.orders.getRecent, { limit: 5 });
  const activeProductCount = useQuery(api.products.getActiveCount);
  const newEnquiryCount = useQuery(api.bespokeEnquiries.getNewCount);
  const recentEnquiries = useQuery(api.bespokeEnquiries.getRecent, { limit: 3 });

  const isStatsLoading =
    orderStats === undefined ||
    activeProductCount === undefined ||
    newEnquiryCount === undefined;

  const stats = isStatsLoading
    ? []
    : [
        {
          name: "Total Revenue",
          value: `£${orderStats.totalRevenue.toFixed(2)}`,
          change: `${orderStats.revenueChange >= 0 ? "+" : ""}${orderStats.revenueChange}%`,
          trend: orderStats.revenueChange >= 0 ? "up" : "down",
          icon: PoundSterling,
        },
        {
          name: "Orders This Month",
          value: String(orderStats.ordersThisMonth),
          change: `${orderStats.ordersChange >= 0 ? "+" : ""}${orderStats.ordersChange}%`,
          trend: orderStats.ordersChange >= 0 ? "up" : "down",
          icon: ShoppingBag,
        },
        {
          name: "Active Products",
          value: String(activeProductCount),
          change: "",
          trend: "up",
          icon: Package,
        },
        {
          name: "New Enquiries",
          value: String(newEnquiryCount),
          change: "",
          trend: newEnquiryCount > 0 ? "up" : "down",
          icon: MessageSquare,
        },
      ];

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
      {isStatsLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
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
              {stat.change && (
                <div className="mt-3 flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-charcoal-400 ml-1">vs last month</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

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
            {recentOrders === undefined ? (
              <OrdersSkeleton />
            ) : recentOrders.length === 0 ? (
              <div className="p-8 text-center text-charcoal-500">
                No orders yet
              </div>
            ) : (
              <div className="divide-y divide-cream-200">
                {recentOrders.map((order) => (
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
                          {formatTimeAgo(order.createdAt)}
                        </p>
                      </div>
                      <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-700"}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {recentEnquiries === undefined ? (
              <EnquiriesSkeleton />
            ) : recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-charcoal-500">
                No enquiries yet
              </div>
            ) : (
              <div className="divide-y divide-cream-200">
                {recentEnquiries.map((enquiry) => (
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
                      {formatTimeAgo(enquiry.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
                <p className="text-xs text-charcoal-400">
                  {orderStats ? `${orderStats.ordersThisMonth} this month` : "View orders"}
                </p>
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
