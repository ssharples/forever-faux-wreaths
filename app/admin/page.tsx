"use client";

import Link from "next/link";
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

// Placeholder stats
const stats = [
  {
    name: "Total Revenue",
    value: "£2,456.00",
    change: "+12.5%",
    trend: "up",
    icon: PoundSterling,
  },
  {
    name: "Orders This Month",
    value: "24",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    name: "Active Products",
    value: "18",
    change: "+2",
    trend: "up",
    icon: Package,
  },
  {
    name: "New Enquiries",
    value: "7",
    change: "-3",
    trend: "down",
    icon: MessageSquare,
  },
];

// Placeholder recent orders
const recentOrders = [
  {
    id: "FFW-001234",
    customer: "Sarah M.",
    total: 65.0,
    status: "processing",
    date: "2 hours ago",
  },
  {
    id: "FFW-001233",
    customer: "Emma T.",
    total: 125.0,
    status: "shipped",
    date: "5 hours ago",
  },
  {
    id: "FFW-001232",
    customer: "Rachel K.",
    total: 45.0,
    status: "delivered",
    date: "1 day ago",
  },
  {
    id: "FFW-001231",
    customer: "Jennifer L.",
    total: 85.0,
    status: "processing",
    date: "1 day ago",
  },
  {
    id: "FFW-001230",
    customer: "Claire B.",
    total: 55.0,
    status: "delivered",
    date: "2 days ago",
  },
];

// Placeholder recent enquiries
const recentEnquiries = [
  {
    id: "ENQ-0056",
    name: "Michelle W.",
    type: "Memorial Wreath",
    status: "new",
    date: "30 mins ago",
  },
  {
    id: "ENQ-0055",
    name: "Amanda D.",
    type: "Wedding Collection",
    status: "quoted",
    date: "3 hours ago",
  },
  {
    id: "ENQ-0054",
    name: "Lisa H.",
    type: "Custom Door Wreath",
    status: "in_progress",
    date: "1 day ago",
  },
];

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  in_progress: "bg-sage-100 text-sage-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
};

export default function AdminDashboard() {
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
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 flex items-center justify-between hover:bg-cream-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-sage-600">
                        {order.customer.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-700">
                        {order.id}
                      </p>
                      <p className="text-sm text-charcoal-500">
                        {order.customer}
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
                        {order.date}
                      </p>
                    </div>
                    <Badge className={statusColors[order.status]}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
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
              {recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="p-4 hover:bg-cream-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-charcoal-700">
                        {enquiry.name}
                      </p>
                      <p className="text-sm text-charcoal-500">
                        {enquiry.type}
                      </p>
                    </div>
                    <Badge className={statusColors[enquiry.status]}>
                      {enquiry.status === "in_progress"
                        ? "In Progress"
                        : enquiry.status.charAt(0).toUpperCase() +
                          enquiry.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-xs text-charcoal-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {enquiry.date}
                  </p>
                </div>
              ))}
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
                <p className="text-xs text-charcoal-400">4 pending</p>
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
