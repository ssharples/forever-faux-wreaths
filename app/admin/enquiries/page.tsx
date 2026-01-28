"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Search,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  Loader2,
  Image as ImageIcon,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type EnquiryStatus = "new" | "in-discussion" | "quoted" | "accepted" | "in-progress" | "complete" | "cancelled";

const statusConfig: Record<EnquiryStatus, { color: string; label: string }> = {
  "new": { color: "bg-blue-100 text-blue-700", label: "New" },
  "in-discussion": { color: "bg-amber-100 text-amber-700", label: "In Discussion" },
  "quoted": { color: "bg-purple-100 text-purple-700", label: "Quoted" },
  "accepted": { color: "bg-sage-100 text-sage-700", label: "Accepted" },
  "in-progress": { color: "bg-orange-100 text-orange-700", label: "In Progress" },
  "complete": { color: "bg-green-100 text-green-700", label: "Complete" },
  "cancelled": { color: "bg-red-100 text-red-700", label: "Cancelled" },
};

const nextStatus: Partial<Record<EnquiryStatus, EnquiryStatus>> = {
  "new": "in-discussion",
  "in-discussion": "quoted",
  "quoted": "accepted",
  "accepted": "in-progress",
  "in-progress": "complete",
};

export default function EnquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EnquiryStatus>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Id<"bespokeEnquiries"> | null>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteTimeline, setQuoteTimeline] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch enquiries from Convex
  const enquiries = useQuery(
    api.bespokeEnquiries.list,
    statusFilter === "all" ? {} : { status: statusFilter }
  );
  const updateStatus = useMutation(api.bespokeEnquiries.updateStatus);

  const isLoading = enquiries === undefined;

  // Get selected enquiry data
  const selectedEnquiryData = enquiries?.find((e) => e._id === selectedEnquiry);

  // Filter enquiries by search query
  const filteredEnquiries = enquiries?.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.arrangementType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) ?? [];

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: enquiries?.length ?? 0,
      new: 0,
      "in-discussion": 0,
      quoted: 0,
      accepted: 0,
      "in-progress": 0,
      complete: 0,
      cancelled: 0,
    };
    enquiries?.forEach((enquiry) => {
      counts[enquiry.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = async (id: Id<"bespokeEnquiries">, newStatus: EnquiryStatus, notes?: string) => {
    setIsUpdating(true);
    try {
      await updateStatus({
        id,
        status: newStatus,
        ...(notes ? { internalNotes: notes } : {}),
      });
      toast.success(`Enquiry updated to ${statusConfig[newStatus].label}`);
    } catch (error) {
      toast.error("Failed to update enquiry");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendQuote = async () => {
    if (!selectedEnquiry) return;
    
    // For now, just update status to quoted and save notes
    const quoteNotes = `Quote: £${quoteAmount}, Timeline: ${quoteTimeline}\n\nMessage: ${quoteMessage}`;
    await handleStatusUpdate(selectedEnquiry, "quoted", quoteNotes);
    
    setQuoteDialogOpen(false);
    setSelectedEnquiry(null);
    setQuoteAmount("");
    setQuoteTimeline("");
    setQuoteMessage("");
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl text-charcoal-700 mb-1">Bespoke Enquiries</h1>
        <p className="text-charcoal-500">
          Manage custom order requests
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(["all", "new", "in-discussion", "quoted", "accepted", "in-progress", "complete"] as const).map((status) => (
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
            {status === "all" ? "All" : statusConfig[status as EnquiryStatus].label}
            <span className="ml-1.5 text-xs opacity-70">
              ({statusCounts[status]})
            </span>
          </Button>
        ))}
      </div>

      {/* Search */}
      <Card className="p-4 mb-6 border-cream-300 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
          <Input
            placeholder="Search by name, email, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-sage-400 mx-auto mb-4" />
          <p className="text-charcoal-500">Loading enquiries...</p>
        </div>
      )}

      {/* Enquiries List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredEnquiries.map((enquiry) => (
            <Card
              key={enquiry._id}
              className="p-6 border-cream-300 bg-white hover:shadow-soft-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-charcoal-700">
                          {enquiry.name}
                        </h3>
                        <Badge className={statusConfig[enquiry.status].color}>
                          {statusConfig[enquiry.status].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-charcoal-500">{enquiry.email}</p>
                      {enquiry.phone && (
                        <p className="text-sm text-charcoal-400">{enquiry.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 mb-4 text-sm">
                    <div>
                      <span className="text-charcoal-400">Type:</span>{" "}
                      <span className="text-charcoal-600">{enquiry.arrangementType}</span>
                    </div>
                    <div>
                      <span className="text-charcoal-400">Size:</span>{" "}
                      <span className="text-charcoal-600">
                        {enquiry.size === "custom" ? enquiry.customSize : enquiry.size}
                      </span>
                    </div>
                    <div>
                      <span className="text-charcoal-400">Occasion:</span>{" "}
                      <span className="text-charcoal-600">{enquiry.occasion}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-charcoal-400 mb-1">Colour Theme:</p>
                    <p className="text-sm text-charcoal-600">
                      {enquiry.colourTheme === "custom" ? enquiry.customColour : enquiry.colourTheme}
                      {enquiry.ribbon && enquiry.ribbonColour && ` • Ribbon: ${enquiry.ribbonColour}`}
                    </p>
                  </div>

                  {enquiry.notes && (
                    <div className="mb-3">
                      <p className="text-sm text-charcoal-400 mb-1">Notes:</p>
                      <p className="text-sm text-charcoal-600 line-clamp-2">
                        {enquiry.notes}
                      </p>
                    </div>
                  )}

                  {enquiry.imageUrls && enquiry.imageUrls.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-sage-500" />
                      <span className="text-sm text-sage-600">
                        {enquiry.imageUrls.length} inspiration image(s) attached
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 lg:flex-none"
                    onClick={() => setSelectedEnquiry(enquiry._id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  {enquiry.status === "new" && (
                    <Button
                      size="sm"
                      className="flex-1 lg:flex-none bg-sage-400 hover:bg-sage-500 text-white"
                      onClick={() => handleStatusUpdate(enquiry._id, "in-discussion")}
                    >
                      Start Discussion
                    </Button>
                  )}
                  {enquiry.status === "in-discussion" && (
                    <Button
                      size="sm"
                      className="flex-1 lg:flex-none bg-sage-400 hover:bg-sage-500 text-white"
                      onClick={() => {
                        setSelectedEnquiry(enquiry._id);
                        setQuoteDialogOpen(true);
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Quote
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedEnquiry(enquiry._id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {nextStatus[enquiry.status] && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(enquiry._id, nextStatus[enquiry.status]!)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark as {statusConfig[nextStatus[enquiry.status]!].label}
                        </DropdownMenuItem>
                      )}
                      {enquiry.status !== "complete" && enquiry.status !== "cancelled" && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleStatusUpdate(enquiry._id, "cancelled")}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-cream-200 flex items-center justify-between text-xs text-charcoal-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Received: {formatDate(enquiry.createdAt)}
                </span>
                {enquiry.estimatedPrice && (
                  <span>Estimated: {enquiry.estimatedPrice}</span>
                )}
              </div>
            </Card>
          ))}

          {filteredEnquiries.length === 0 && (
            <Card className="p-12 border-cream-300 bg-white text-center">
              <MessageSquare className="h-12 w-12 text-sage-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-charcoal-700 mb-2">
                No enquiries found
              </h3>
              <p className="text-charcoal-500">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Bespoke enquiries will appear here"}
              </p>
            </Card>
          )}
        </div>
      )}

      {/* View Enquiry Dialog */}
      <Dialog
        open={!!selectedEnquiry && !quoteDialogOpen}
        onOpenChange={(open) => !open && setSelectedEnquiry(null)}
      >
        {selectedEnquiryData && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Enquiry Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-charcoal-400">Customer</p>
                  <p className="font-medium text-charcoal-700">
                    {selectedEnquiryData.name}
                  </p>
                  <p className="text-sm text-charcoal-500">
                    {selectedEnquiryData.email}
                  </p>
                  {selectedEnquiryData.phone && (
                    <p className="text-sm text-charcoal-400">
                      {selectedEnquiryData.phone}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-charcoal-400">Status</p>
                  <Badge className={statusConfig[selectedEnquiryData.status].color}>
                    {statusConfig[selectedEnquiryData.status].label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-charcoal-400">Arrangement Type</p>
                  <p className="text-charcoal-700">{selectedEnquiryData.arrangementType}</p>
                </div>
                <div>
                  <p className="text-sm text-charcoal-400">Size</p>
                  <p className="text-charcoal-700">
                    {selectedEnquiryData.size === "custom" 
                      ? selectedEnquiryData.customSize 
                      : selectedEnquiryData.size}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-charcoal-400">Wreath Base</p>
                  <p className="text-charcoal-700">{selectedEnquiryData.wreathBase}</p>
                </div>
                <div>
                  <p className="text-sm text-charcoal-400">Occasion</p>
                  <p className="text-charcoal-700">{selectedEnquiryData.occasion}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-charcoal-400 mb-1">Colour Theme</p>
                <p className="text-charcoal-700">
                  {selectedEnquiryData.colourTheme === "custom" 
                    ? selectedEnquiryData.customColour 
                    : selectedEnquiryData.colourTheme}
                </p>
              </div>

              {selectedEnquiryData.ribbon && (
                <div>
                  <p className="text-sm text-charcoal-400 mb-1">Ribbon</p>
                  <p className="text-charcoal-700">
                    Yes - {selectedEnquiryData.ribbonColour}
                  </p>
                </div>
              )}

              {selectedEnquiryData.notes && (
                <div>
                  <p className="text-sm text-charcoal-400 mb-1">Customer Notes</p>
                  <p className="text-charcoal-700 whitespace-pre-wrap">
                    {selectedEnquiryData.notes}
                  </p>
                </div>
              )}

              {selectedEnquiryData.internalNotes && (
                <div className="bg-cream-50 p-4 rounded-lg">
                  <p className="text-sm text-charcoal-400 mb-1">Internal Notes</p>
                  <p className="text-charcoal-700 whitespace-pre-wrap">
                    {selectedEnquiryData.internalNotes}
                  </p>
                </div>
              )}

              {selectedEnquiryData.imageUrls && selectedEnquiryData.imageUrls.length > 0 && (
                <div>
                  <p className="text-sm text-charcoal-400 mb-2">Inspiration Images</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedEnquiryData.imageUrls.map((url, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={url}
                          alt={`Inspiration ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedEnquiryData.status === "in-discussion" && (
                  <Button
                    className="bg-sage-400 hover:bg-sage-500 text-white"
                    onClick={() => setQuoteDialogOpen(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Quote
                  </Button>
                )}
                {nextStatus[selectedEnquiryData.status] && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusUpdate(selectedEnquiryData._id, nextStatus[selectedEnquiryData.status]!);
                      setSelectedEnquiry(null);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as {statusConfig[nextStatus[selectedEnquiryData.status]!].label}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Quote Dialog */}
      <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Quote</DialogTitle>
            <DialogDescription>
              Provide a quote for this bespoke enquiry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="quoteAmount">Quote Amount (£)</Label>
              <Input 
                id="quoteAmount"
                type="number" 
                step="0.01"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(e.target.value)}
                placeholder="75.00" 
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="quoteTimeline">Estimated Timeline</Label>
              <Input 
                id="quoteTimeline"
                value={quoteTimeline}
                onChange={(e) => setQuoteTimeline(e.target.value)}
                placeholder="1-2 weeks" 
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="quoteMessage">Message</Label>
              <Textarea
                id="quoteMessage"
                value={quoteMessage}
                onChange={(e) => setQuoteMessage(e.target.value)}
                placeholder="Thank you for your enquiry! I'd love to create this for you..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendQuote}
              disabled={isUpdating || !quoteAmount}
              className="bg-sage-400 hover:bg-sage-500 text-white"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Quote
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
