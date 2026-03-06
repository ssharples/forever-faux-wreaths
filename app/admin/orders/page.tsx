"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MoreHorizontal,
  Eye,
  Truck,
  Package,
  Clock,
  CheckCircle2,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { timeAgo } from "@/lib/format-date";
import { toast } from "sonner";

const statusConfig: Record<
  string,
  { color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: { color: "bg-amber-100 text-amber-700", icon: Clock },
  processing: { color: "bg-blue-100 text-blue-700", icon: Package },
  dispatched: { color: "bg-purple-100 text-purple-700", icon: Truck },
  delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  collected: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const allOrders = useQuery(api.orders.list, {});
  const updateOrderStatus = useMutation(api.orders.updateStatus);

  const ordersList = allOrders ?? [];

  const filteredOrders = ordersList.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: ordersList.length,
      pending: 0,
      processing: 0,
      dispatched: 0,
      delivered: 0,
      collected: 0,
    };
    ordersList.forEach((order) => {
      counts[order.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (allOrders === undefined) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
          <p className="text-charcoal-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl text-charcoal-700 mb-1">Orders</h1>
        <p className="text-charcoal-500">
          View and manage customer orders
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "pending", "processing", "dispatched", "delivered", "collected"].map(
          (status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={
                statusFilter === status
                  ? "bg-sage-400 hover:bg-sage-500 text-white"
                  : "border-cream-300"
              }
            >
              {status === "all"
                ? "All"
                : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1.5 text-xs opacity-70">
                ({statusCounts[status] ?? 0})
              </span>
            </Button>
          )
        )}
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6 border-cream-300 bg-white">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
            <Input
              placeholder="Search orders by ID, customer, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select defaultValue="newest">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Value</SelectItem>
              <SelectItem value="lowest">Lowest Value</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="border-cream-300 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-50 border-b border-cream-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  <button className="flex items-center gap-1 hover:text-charcoal-800">
                    Order
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Delivery
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  <button className="flex items-center gap-1 hover:text-charcoal-800">
                    Total
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  <button className="flex items-center gap-1 hover:text-charcoal-800">
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-charcoal-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filteredOrders.map((order) => {
                const config = statusConfig[order.status];
                const StatusIcon = config?.icon ?? Clock;
                const statusColor = config?.color ?? "bg-gray-100 text-gray-700";
                return (
                  <tr
                    key={order._id}
                    className="hover:bg-cream-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-charcoal-700">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-charcoal-400">
                          {order.items.length} item(s)
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-charcoal-700">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-charcoal-400">
                          {order.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`${statusColor} flex items-center gap-1 w-fit`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-charcoal-600 capitalize">
                        {order.deliveryMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-charcoal-700">
                        £{order.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-charcoal-500">
                        {timeAgo(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/orders/${order._id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {order.status === "pending" && (
                            <DropdownMenuItem onClick={() => {
                              updateOrderStatus({ id: order._id, status: "processing" });
                              toast.success("Order marked as processing");
                            }}>
                              <Package className="h-4 w-4 mr-2" />
                              Mark Processing
                            </DropdownMenuItem>
                          )}
                          {order.status === "processing" && (
                            <DropdownMenuItem onClick={() => {
                              updateOrderStatus({ id: order._id, status: "dispatched" });
                              toast.success("Order marked as dispatched");
                            }}>
                              <Truck className="h-4 w-4 mr-2" />
                              Mark Dispatched
                            </DropdownMenuItem>
                          )}
                          {order.status === "dispatched" && (
                            <DropdownMenuItem onClick={() => {
                              updateOrderStatus({ id: order._id, status: "delivered" });
                              toast.success("Order marked as delivered");
                            }}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Mark Delivered
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-sage-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-charcoal-700 mb-2">
              No orders found
            </h3>
            <p className="text-charcoal-500">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Orders will appear here when customers make purchases"}
            </p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-charcoal-500">
          <span>
            Showing {filteredOrders.length} of {ordersList.length} orders
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
