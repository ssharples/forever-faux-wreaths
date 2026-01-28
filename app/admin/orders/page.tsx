"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Search,
  MoreHorizontal,
  Eye,
  Truck,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Loader2,
  MapPin,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type OrderStatus = "pending" | "processing" | "dispatched" | "delivered" | "collected";

const statusConfig: Record<
  OrderStatus,
  { color: string; icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  pending: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Pending" },
  processing: { color: "bg-blue-100 text-blue-700", icon: Package, label: "Processing" },
  dispatched: { color: "bg-purple-100 text-purple-700", icon: Truck, label: "Dispatched" },
  delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle2, label: "Delivered" },
  collected: { color: "bg-green-100 text-green-700", icon: MapPin, label: "Collected" },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [trackingDialog, setTrackingDialog] = useState<{
    open: boolean;
    orderId: Id<"orders"> | null;
    orderNumber: string;
  }>({ open: false, orderId: null, orderNumber: "" });
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch orders from Convex
  const orders = useQuery(
    api.orders.list,
    statusFilter === "all" ? {} : { status: statusFilter }
  );
  const updateOrderStatus = useMutation(api.orders.updateStatus);

  const isLoading = orders === undefined;

  // Filter orders by search query
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) ?? [];

  // Get status counts
  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: orders?.length ?? 0,
      pending: 0,
      processing: 0,
      dispatched: 0,
      delivered: 0,
      collected: 0,
    };
    orders?.forEach((order) => {
      counts[order.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  const handleStatusUpdate = async (orderId: Id<"orders">, newStatus: OrderStatus, trackingNum?: string) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus({
        id: orderId,
        status: newStatus,
        ...(trackingNum ? { trackingNumber: trackingNum } : {}),
      });
      toast.success(`Order updated to ${statusConfig[newStatus].label}`);
      setTrackingDialog({ open: false, orderId: null, orderNumber: "" });
      setTrackingNumber("");
    } catch (error) {
      toast.error("Failed to update order");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDispatch = (orderId: Id<"orders">, orderNumber: string) => {
    setTrackingDialog({ open: true, orderId, orderNumber });
  };

  const confirmDispatch = () => {
    if (trackingDialog.orderId) {
      handleStatusUpdate(trackingDialog.orderId, "dispatched", trackingNumber || undefined);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        {(["all", "pending", "processing", "dispatched", "delivered", "collected"] as const).map(
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
                : statusConfig[status as OrderStatus].label}
              <span className="ml-1.5 text-xs opacity-70">
                ({statusCounts[status]})
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
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-sage-400 mx-auto mb-4" />
            <p className="text-charcoal-500">Loading orders...</p>
          </div>
        ) : (
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
                  const StatusIcon = statusConfig[order.status].icon;
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
                          className={`${statusConfig[order.status].color} flex items-center gap-1 w-fit`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[order.status].label}
                        </Badge>
                        {order.trackingNumber && (
                          <p className="text-xs text-charcoal-400 mt-1">
                            Track: {order.trackingNumber}
                          </p>
                        )}
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
                          {formatDate(order.createdAt)}
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
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(order._id, "processing")}
                              >
                                <Package className="h-4 w-4 mr-2" />
                                Mark as Processing
                              </DropdownMenuItem>
                            )}
                            {order.status === "processing" && order.deliveryMethod === "standard" && (
                              <DropdownMenuItem
                                onClick={() => handleDispatch(order._id, order.orderNumber)}
                              >
                                <Truck className="h-4 w-4 mr-2" />
                                Mark as Dispatched
                              </DropdownMenuItem>
                            )}
                            {order.status === "processing" && order.deliveryMethod === "collection" && (
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(order._id, "collected")}
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                Mark as Collected
                              </DropdownMenuItem>
                            )}
                            {order.status === "dispatched" && (
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(order._id, "delivered")}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark as Delivered
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
        )}

        {!isLoading && filteredOrders.length === 0 && (
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
      {!isLoading && filteredOrders.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-charcoal-500">
          <span>
            Showing {filteredOrders.length} of {orders?.length ?? 0} orders
          </span>
        </div>
      )}

      {/* Tracking Number Dialog */}
      <Dialog
        open={trackingDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setTrackingDialog({ open: false, orderId: null, orderNumber: "" });
            setTrackingNumber("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispatch Order</DialogTitle>
            <DialogDescription>
              Add a tracking number for order {trackingDialog.orderNumber} (optional).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="tracking">Tracking Number</Label>
            <Input
              id="tracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g., RM123456789GB"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setTrackingDialog({ open: false, orderId: null, orderNumber: "" });
                setTrackingNumber("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDispatch}
              disabled={isUpdating}
              className="bg-sage-400 hover:bg-sage-500 text-white"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Mark as Dispatched"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
