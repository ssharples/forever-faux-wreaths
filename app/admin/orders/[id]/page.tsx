"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Mail,
  Phone,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type OrderStatus = "pending" | "processing" | "dispatched" | "delivered" | "collected";

const statusConfig: Record<
  OrderStatus,
  { color: string; bgColor: string; icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  pending: { color: "text-amber-700", bgColor: "bg-amber-100", icon: Clock, label: "Pending" },
  processing: { color: "text-blue-700", bgColor: "bg-blue-100", icon: Package, label: "Processing" },
  dispatched: { color: "text-purple-700", bgColor: "bg-purple-100", icon: Truck, label: "Dispatched" },
  delivered: { color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle2, label: "Delivered" },
  collected: { color: "text-green-700", bgColor: "bg-green-100", icon: MapPin, label: "Collected" },
};

const statusFlow: OrderStatus[] = ["pending", "processing", "dispatched", "delivered"];
const collectionFlow: OrderStatus[] = ["pending", "processing", "collected"];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as Id<"orders">;

  const [trackingDialog, setTrackingDialog] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const order = useQuery(api.orders.getById, { id: orderId });
  const updateOrderStatus = useMutation(api.orders.updateStatus);

  if (order === undefined) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-sage-400" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="p-12 text-center border-cream-300 bg-white">
          <h2 className="text-xl text-charcoal-700 mb-2">Order Not Found</h2>
          <p className="text-charcoal-500 mb-4">This order may have been deleted.</p>
          <Button asChild variant="outline">
            <Link href="/admin/orders">Back to Orders</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const flow = order.deliveryMethod === "collection" ? collectionFlow : statusFlow;
  const currentIndex = flow.indexOf(order.status);
  const StatusIcon = statusConfig[order.status].icon;

  const handleStatusUpdate = async (newStatus: OrderStatus, tracking?: string) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus({
        id: orderId,
        status: newStatus,
        ...(tracking ? { trackingNumber: tracking } : {}),
      });
      toast.success(`Order updated to ${statusConfig[newStatus].label}`);
      setTrackingDialog(false);
      setTrackingNumber("");
    } catch (error) {
      toast.error("Failed to update order");
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextStatus = (): OrderStatus | null => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < flow.length) {
      return flow[nextIndex];
    }
    return null;
  };

  const nextStatus = getNextStatus();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-sm text-charcoal-500 hover:text-sage-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl text-charcoal-700 mb-1">
              Order {order.orderNumber}
            </h1>
            <p className="text-charcoal-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge className={`${statusConfig[order.status].bgColor} ${statusConfig[order.status].color} flex items-center gap-1.5 px-3 py-1.5`}>
            <StatusIcon className="h-4 w-4" />
            {statusConfig[order.status].label}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="p-6 border-cream-300 bg-white">
            <h2 className="text-lg font-medium text-charcoal-700 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-cream-50 rounded-lg"
                >
                  <div className="w-16 h-16 bg-cream-200 rounded-lg flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-sage-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal-700">{item.title}</p>
                    <p className="text-sm text-charcoal-500">
                      Qty: {item.quantity} × £{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium text-charcoal-700">
                    £{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal</span>
                <span>£{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Delivery</span>
                <span>
                  {order.deliveryCost === 0 ? "Free" : `£${order.deliveryCost.toFixed(2)}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-medium text-charcoal-700">
                <span>Total</span>
                <span>£{order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Customer Notes */}
          {order.notes && (
            <Card className="p-6 border-cream-300 bg-white">
              <h2 className="text-lg font-medium text-charcoal-700 mb-2">
                Customer Notes
              </h2>
              <p className="text-charcoal-600">{order.notes}</p>
            </Card>
          )}

          {/* Status Timeline */}
          <Card className="p-6 border-cream-300 bg-white">
            <h2 className="text-lg font-medium text-charcoal-700 mb-4">
              Order Progress
            </h2>
            <div className="relative">
              <div className="flex justify-between">
                {flow.map((status, index) => {
                  const StepIcon = statusConfig[status].icon;
                  const isComplete = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  return (
                    <div
                      key={status}
                      className={`flex flex-col items-center flex-1 ${
                        index < flow.length - 1 ? "relative" : ""
                      }`}
                    >
                      {/* Connector line */}
                      {index < flow.length - 1 && (
                        <div
                          className={`absolute top-5 left-1/2 w-full h-0.5 ${
                            index < currentIndex ? "bg-sage-400" : "bg-cream-300"
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                          isComplete
                            ? "bg-sage-400 text-white"
                            : "bg-cream-200 text-charcoal-400"
                        } ${isCurrent ? "ring-4 ring-sage-100" : ""}`}
                      >
                        <StepIcon className="h-5 w-5" />
                      </div>

                      {/* Label */}
                      <p
                        className={`mt-2 text-xs text-center ${
                          isComplete ? "text-charcoal-700 font-medium" : "text-charcoal-400"
                        }`}
                      >
                        {statusConfig[status].label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            {nextStatus && (
              <div className="mt-6 pt-4 border-t border-cream-200">
                {nextStatus === "dispatched" ? (
                  <Button
                    onClick={() => setTrackingDialog(true)}
                    className="bg-sage-400 hover:bg-sage-500 text-white"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Mark as Dispatched
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleStatusUpdate(nextStatus)}
                    disabled={isUpdating}
                    className="bg-sage-400 hover:bg-sage-500 text-white"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Mark as {statusConfig[nextStatus].label}
                  </Button>
                )}
              </div>
            )}

            {/* Tracking info */}
            {order.trackingNumber && (
              <div className="mt-4 p-3 bg-sage-50 rounded-lg">
                <p className="text-sm text-sage-700">
                  <strong>Tracking Number:</strong> {order.trackingNumber}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Details */}
          <Card className="p-6 border-cream-300 bg-white">
            <h2 className="text-lg font-medium text-charcoal-700 mb-4">
              Customer
            </h2>
            <div className="space-y-3">
              <p className="font-medium text-charcoal-700">{order.customerName}</p>
              <div className="flex items-center gap-2 text-charcoal-600">
                <Mail className="h-4 w-4 text-charcoal-400" />
                <a href={`mailto:${order.customerEmail}`} className="hover:text-sage-600">
                  {order.customerEmail}
                </a>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-2 text-charcoal-600">
                  <Phone className="h-4 w-4 text-charcoal-400" />
                  <a href={`tel:${order.customerPhone}`} className="hover:text-sage-600">
                    {order.customerPhone}
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Delivery Details */}
          <Card className="p-6 border-cream-300 bg-white">
            <h2 className="text-lg font-medium text-charcoal-700 mb-4">
              {order.deliveryMethod === "collection" ? "Collection" : "Delivery Address"}
            </h2>
            {order.deliveryMethod === "collection" ? (
              <p className="text-charcoal-600">
                Customer will collect from Preston, Lancashire
              </p>
            ) : (
              <div className="text-charcoal-600 space-y-1">
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>{order.shippingAddress.city}</p>
                {order.shippingAddress.county && <p>{order.shippingAddress.county}</p>}
                <p>{order.shippingAddress.postcode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            )}
          </Card>

          {/* Payment Details */}
          <Card className="p-6 border-cream-300 bg-white">
            <h2 className="text-lg font-medium text-charcoal-700 mb-4">
              Payment
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-charcoal-400" />
                <span className="text-charcoal-600 capitalize">
                  {order.paymentMethod}
                </span>
              </div>
              <p className="text-sm text-charcoal-500">
                Payment ID: {order.paymentId}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Tracking Dialog */}
      <Dialog open={trackingDialog} onOpenChange={setTrackingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispatch Order</DialogTitle>
            <DialogDescription>
              Add a tracking number for order {order.orderNumber} (optional).
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
            <Button variant="outline" onClick={() => setTrackingDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusUpdate("dispatched", trackingNumber || undefined)}
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
