"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { AlertTriangle, ArrowLeft, Loader2, Mail, Save } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const statuses = ["pending", "processing", "shipped", "completed", "issue", "collected"] as const;

const statusLabels: Record<(typeof statuses)[number] | "dispatched" | "delivered", string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  completed: "Completed",
  issue: "Issue",
  collected: "Collected",
  dispatched: "Shipped",
  delivered: "Completed",
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const orderId = params.id as Id<"orders">;
  const order = useQuery(api.orders.getById, { id: orderId });
  const communications = useQuery(api.orders.getCommunications, { orderId });
  const updateOrderStatus = useMutation(api.orders.updateStatus);
  const sendCustomerMessage = useMutation(api.orders.sendCustomerMessage);
  const [status, setStatus] = useState<(typeof statuses)[number]>("pending");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [markAsIssue, setMarkAsIssue] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    if (!order) return;
    setStatus(
      order.status === "dispatched"
        ? "shipped"
        : order.status === "delivered"
          ? "completed"
          : order.status
    );
    setTrackingNumber(order.trackingNumber ?? "");
  }, [order]);

  if (order === undefined) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-charcoal-500 mb-4">Order not found.</p>
        <Button asChild variant="outline">
          <Link href="/admin/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateOrderStatus({
        id: order._id,
        status,
        trackingNumber: trackingNumber || undefined,
      });
      toast.success("Order updated");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update order");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendMessage = async () => {
    setIsSendingMessage(true);
    try {
      await sendCustomerMessage({
        orderId: order._id,
        subject: messageSubject,
        message: messageBody,
        markAsIssue,
      });
      toast.success("Customer email queued");
      setMessageSubject("");
      setMessageBody("");
      setMarkAsIssue(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal-500 hover:text-charcoal-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
        <h1 className="text-3xl text-charcoal-700">{order.orderNumber}</h1>
        <p className="text-charcoal-500">{order.customerName} · {order.customerEmail}</p>
        {order.status === "issue" && (
          <Badge className="mt-3 bg-red-100 text-red-700">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Issue flagged
          </Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 border-cream-300 bg-white lg:col-span-2">
          <h2 className="text-lg font-medium text-charcoal-700 mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.title}`} className="flex items-center justify-between border-b border-cream-200 pb-4 last:border-b-0 last:pb-0">
                <div>
                  <p className="font-medium text-charcoal-700">{item.title}</p>
                  <p className="text-sm text-charcoal-400">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium text-charcoal-700">£{item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-cream-300 bg-white space-y-4">
          <h2 className="text-lg font-medium text-charcoal-700">Manage order</h2>
          <div>
            <Label htmlFor="order-detail-status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as (typeof statuses)[number])}>
              <SelectTrigger id="order-detail-status" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((value) => (
                  <SelectItem key={value} value={value}>
                    {statusLabels[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="order-detail-tracking-number">Tracking number</Label>
            <Input
              id="order-detail-tracking-number"
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              className="mt-1"
              placeholder="Optional"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-sage-400 hover:bg-sage-500 text-white"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save changes
          </Button>
        </Card>
      </div>

      <Card className="p-6 border-cream-300 bg-white">
        <h2 className="text-lg font-medium text-charcoal-700 mb-4">Delivery</h2>
        <p className="text-charcoal-600 capitalize mb-2">{order.deliveryMethod}</p>
        <p className="text-charcoal-500">{order.shippingAddress.line1}</p>
        {order.shippingAddress.line2 && <p className="text-charcoal-500">{order.shippingAddress.line2}</p>}
        <p className="text-charcoal-500">
          {order.shippingAddress.city} {order.shippingAddress.postcode}
        </p>
        <p className="text-charcoal-500">{order.shippingAddress.country}</p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 border-cream-300 bg-white">
          <h2 className="text-lg font-medium text-charcoal-700 mb-4">
            Customer communication
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="order-message-subject">Subject</Label>
              <Input
                id="order-message-subject"
                value={messageSubject}
                onChange={(event) => setMessageSubject(event.target.value)}
                className="mt-1"
                placeholder={`Update about ${order.orderNumber}`}
              />
            </div>
            <div>
              <Label htmlFor="order-message-body">Message</Label>
              <Textarea
                id="order-message-body"
                value={messageBody}
                onChange={(event) => setMessageBody(event.target.value)}
                className="mt-1 min-h-32"
                placeholder="Write the customer update..."
              />
            </div>
            <label className="flex items-start gap-3 rounded-lg bg-cream-50 p-3 text-sm text-charcoal-600">
              <Checkbox
                id="order-message-mark-issue"
                checked={markAsIssue}
                onCheckedChange={(checked) => setMarkAsIssue(checked === true)}
              />
              <span>Mark this order as having an issue after sending</span>
            </label>
            <Button
              onClick={handleSendMessage}
              disabled={isSendingMessage}
              className="w-full bg-sage-400 hover:bg-sage-500 text-white"
            >
              {isSendingMessage ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              Send customer email
            </Button>
          </div>
        </Card>

        <Card className="p-6 border-cream-300 bg-white">
          <h2 className="text-lg font-medium text-charcoal-700 mb-4">
            Email history
          </h2>
          {communications === undefined ? (
            <div className="flex items-center gap-2 text-sm text-charcoal-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading emails...
            </div>
          ) : communications.length === 0 ? (
            <p className="text-sm text-charcoal-500">
              No manual customer emails have been sent for this order.
            </p>
          ) : (
            <div className="space-y-3">
              {communications.map((communication) => (
                <div
                  key={communication._id}
                  className="rounded-lg border border-cream-300 bg-cream-50 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-charcoal-700">
                        {communication.subject}
                      </p>
                      <p className="text-xs text-charcoal-400">
                        {new Date(communication.createdAt).toLocaleString("en-GB")}
                      </p>
                    </div>
                    <Badge
                      className={
                        communication.status === "sent"
                          ? "bg-green-100 text-green-700"
                          : communication.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }
                    >
                      {communication.status}
                    </Badge>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-charcoal-600">
                    {communication.message}
                  </p>
                  {communication.error && (
                    <p className="mt-2 text-xs text-red-600">
                      {communication.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
