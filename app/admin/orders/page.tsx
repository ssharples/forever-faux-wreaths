"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  MoreHorizontal,
  Eye,
  Truck,
  Package,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { timeAgo } from "@/lib/format-date";
import { toast } from "sonner";

const statusConfig: Record<
  string,
  { color: string; icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  pending: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Pending" },
  processing: { color: "bg-blue-100 text-blue-700", icon: Package, label: "Processing" },
  shipped: { color: "bg-purple-100 text-purple-700", icon: Truck, label: "Shipped" },
  completed: { color: "bg-green-100 text-green-700", icon: CheckCircle2, label: "Completed" },
  issue: { color: "bg-red-100 text-red-700", icon: Clock, label: "Issue" },
  dispatched: { color: "bg-purple-100 text-purple-700", icon: Truck, label: "Shipped" },
  delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle2, label: "Completed" },
  collected: { color: "bg-green-100 text-green-700", icon: CheckCircle2, label: "Collected" },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [smartFilter, setSmartFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const allOrders = useQuery(api.orders.list, {});
  const updateOrderStatus = useMutation(api.orders.updateStatus);

  const ordersList = allOrders ?? [];
  const revenue = ordersList.reduce((sum, order) => sum + order.total, 0);

  useEffect(() => {
    const saved = window.localStorage.getItem("admin-orders-preferences");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as {
        statusFilter?: string;
        smartFilter?: string;
        sortOrder?: string;
      };
      if (parsed.statusFilter) setStatusFilter(parsed.statusFilter);
      if (parsed.smartFilter) setSmartFilter(parsed.smartFilter);
      if (parsed.sortOrder) setSortOrder(parsed.sortOrder);
    } catch {
      window.localStorage.removeItem("admin-orders-preferences");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "admin-orders-preferences",
      JSON.stringify({ statusFilter, smartFilter, sortOrder })
    );
  }, [statusFilter, smartFilter, sortOrder]);

  const filteredOrders = useMemo(() => {
    const now = Date.now();

    const filtered = ordersList.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesSmartFilter =
        smartFilter === "all" ||
        (smartFilter === "needs-tracking" &&
          (order.status === "shipped" || order.status === "dispatched") &&
          !order.trackingNumber) ||
        (smartFilter === "overdue" &&
          ((order.status === "pending" &&
            now - order.createdAt > 2 * 24 * 60 * 60 * 1000) ||
            (order.status === "processing" &&
              now - order.createdAt > 10 * 24 * 60 * 60 * 1000) ||
            ((order.status === "shipped" || order.status === "dispatched") &&
              now - order.createdAt > 16 * 24 * 60 * 60 * 1000)));

      return matchesSearch && matchesStatus && matchesSmartFilter;
    });

    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case "oldest":
          return a.createdAt - b.createdAt;
        case "highest":
          return b.total - a.total;
        case "lowest":
          return a.total - b.total;
        default:
          return b.createdAt - a.createdAt;
      }
    });
  }, [ordersList, searchQuery, smartFilter, sortOrder, statusFilter]);

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: ordersList.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
      issue: 0,
      dispatched: 0,
      delivered: 0,
      collected: 0,
    };
    ordersList.forEach((order) => {
      counts[order.status]++;
      if (order.status === "dispatched") counts.shipped++;
      if (order.status === "delivered") counts.completed++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
  const summaryCards = [
    { label: "Pending", value: statusCounts.pending, tone: "text-amber-700 bg-amber-50" },
    { label: "In progress", value: statusCounts.processing, tone: "text-blue-700 bg-blue-50" },
    { label: "Shipped", value: statusCounts.shipped, tone: "text-purple-700 bg-purple-50" },
    { label: "Revenue", value: `£${revenue.toFixed(2)}`, tone: "text-sage-700 bg-sage-50" },
  ];

  const handleStatusUpdate = async (
    id: Id<"orders">,
    status: "processing" | "shipped" | "completed",
    successMessage: string
  ) => {
    setUpdatingOrderId(id);
    try {
      await updateOrderStatus({ id, status });
      toast.success(successMessage);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update order"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {summaryCards.map((card) => (
          <Card key={card.label} className="p-4 border-cream-300 bg-white">
            <p className="text-sm text-charcoal-500 mb-2">{card.label}</p>
            <p className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${card.tone}`}>
              {card.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "pending", "processing", "shipped", "completed", "issue", "collected"].map(
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
                : statusConfig[status]?.label ?? status.charAt(0).toUpperCase() + status.slice(1)}
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
          <Select value={smartFilter} onValueChange={setSmartFilter}>
            <SelectTrigger className="w-full sm:w-[210px]">
              <SelectValue placeholder="Saved view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All orders</SelectItem>
              <SelectItem value="needs-tracking">Needs tracking</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="highest">Highest value</SelectItem>
              <SelectItem value="lowest">Lowest value</SelectItem>
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
                  Order
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
                  Next Step
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Date
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
                const statusLabel =
                  config?.label ??
                  order.status.charAt(0).toUpperCase() + order.status.slice(1);
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
                        {statusLabel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <span className="text-charcoal-600 capitalize">
                          {order.deliveryMethod}
                        </span>
                        {order.trackingNumber && (
                          <p className="text-xs text-charcoal-400 mt-1">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updatingOrderId === order._id}
                          onClick={() =>
                            void handleStatusUpdate(
                              order._id,
                              "processing",
                              "Order marked as processing"
                            )
                          }
                        >
                          {updatingOrderId === order._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Start"
                          )}
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updatingOrderId === order._id}
                          onClick={() =>
                            void handleStatusUpdate(
                              order._id,
                              "shipped",
                              "Order marked as shipped"
                            )
                          }
                        >
                          {updatingOrderId === order._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Dispatch"
                          )}
                        </Button>
                      )}
                      {(order.status === "shipped" || order.status === "dispatched") && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updatingOrderId === order._id}
                          onClick={() =>
                            void handleStatusUpdate(
                              order._id,
                              "completed",
                              "Order marked as completed"
                            )
                          }
                        >
                          {updatingOrderId === order._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Complete"
                          )}
                        </Button>
                      )}
                      {(order.status === "completed" ||
                        order.status === "delivered" ||
                        order.status === "collected") && (
                        <span className="text-sm text-charcoal-400">Done</span>
                      )}
                      {order.status === "issue" && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/orders/${order._id}`}>Resolve</Link>
                        </Button>
                      )}
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="min-h-[44px] min-w-[44px]"
                            aria-label={`Open actions for order ${order.orderNumber}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/orders/${order._id}`} className="min-h-[44px]">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {order.status === "pending" && (
                            <DropdownMenuItem
                              className="min-h-[44px]"
                              disabled={updatingOrderId === order._id}
                              onClick={() =>
                                void handleStatusUpdate(
                                  order._id,
                                  "processing",
                                  "Order marked as processing"
                                )
                              }
                            >
                              <Package className="h-4 w-4 mr-2" />
                              Mark Processing
                            </DropdownMenuItem>
                          )}
                          {order.status === "processing" && (
                            <DropdownMenuItem
                              className="min-h-[44px]"
                              disabled={updatingOrderId === order._id}
                              onClick={() =>
                                void handleStatusUpdate(
                                  order._id,
                                  "shipped",
                                  "Order marked as shipped"
                                )
                              }
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Mark Shipped
                            </DropdownMenuItem>
                          )}
                          {(order.status === "shipped" || order.status === "dispatched") && (
                            <DropdownMenuItem
                              className="min-h-[44px]"
                              disabled={updatingOrderId === order._id}
                              onClick={() =>
                                void handleStatusUpdate(
                                  order._id,
                                  "completed",
                                  "Order marked as completed"
                                )
                              }
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Mark Completed
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

      {filteredOrders.length > 0 && (
        <div className="mt-4 text-sm text-charcoal-500">
          Showing {filteredOrders.length} of {ordersList.length} orders
        </div>
      )}
    </div>
  );
}
