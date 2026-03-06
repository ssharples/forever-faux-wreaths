"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { timeAgo } from "@/lib/format-date";
import { toast } from "sonner";
import Image from "next/image";

const statusConfig: Record<string, { color: string; label: string }> = {
  "new": { color: "bg-blue-100 text-blue-700", label: "New" },
  "in-discussion": { color: "bg-amber-100 text-amber-700", label: "In Discussion" },
  "quoted": { color: "bg-purple-100 text-purple-700", label: "Quoted" },
  "accepted": { color: "bg-sage-100 text-sage-700", label: "Accepted" },
  "in-progress": { color: "bg-amber-100 text-amber-700", label: "In Progress" },
  "complete": { color: "bg-green-100 text-green-700", label: "Complete" },
  "cancelled": { color: "bg-red-100 text-red-700", label: "Cancelled" },
};

const statusTabs = ["all", "new", "in-discussion", "quoted", "accepted", "in-progress", "complete"];

export default function EnquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);

  const allEnquiries = useQuery(api.bespokeEnquiries.list, {});
  const updateEnquiryStatus = useMutation(api.bespokeEnquiries.updateStatus);

  const enquiries = allEnquiries ?? [];

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.arrangementType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: enquiries.length,
      "new": 0,
      "in-discussion": 0,
      "quoted": 0,
      "accepted": 0,
      "in-progress": 0,
      "complete": 0,
      "cancelled": 0,
    };
    enquiries.forEach((enquiry) => {
      counts[enquiry.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

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
        {statusTabs.map((status) => (
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
            {status === "all" ? "All" : statusConfig[status]?.label ?? status}
            <span className="ml-1.5 text-xs opacity-70">
              ({statusCounts[status] ?? 0})
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

      {/* Enquiries List */}
      {allEnquiries === undefined ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sage-400" />
        </div>
      ) : (
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
                      <Badge className={statusConfig[enquiry.status]?.color ?? "bg-gray-100 text-gray-700"}>
                        {statusConfig[enquiry.status]?.label ?? enquiry.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-charcoal-500">{enquiry.email}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-charcoal-400">Type:</span>{" "}
                    <span className="text-charcoal-600">{enquiry.arrangementType}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-400">Size:</span>{" "}
                    <span className="text-charcoal-600">{enquiry.size}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-400">Budget:</span>{" "}
                    <span className="text-charcoal-600">{enquiry.estimatedPrice ?? "Not specified"}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-charcoal-400 mb-1">Colors:</p>
                  <p className="text-sm text-charcoal-600">{enquiry.colourTheme}{enquiry.customColour ? ` - ${enquiry.customColour}` : ""}</p>
                </div>

                {enquiry.notes && (
                  <div>
                    <p className="text-sm text-charcoal-400 mb-1">Message:</p>
                    <p className="text-sm text-charcoal-600 line-clamp-2">
                      {enquiry.notes}
                    </p>
                  </div>
                )}

                {enquiry.imageUrls && enquiry.imageUrls.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {enquiry.imageUrls.map((url: string, i: number) => (
                      <div key={i} className="w-16 h-16 rounded-md overflow-hidden bg-cream-200 relative">
                        <Image src={url} alt="Inspiration" fill className="object-cover" sizes="64px" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 lg:flex-none"
                  onClick={() => setSelectedEnquiry(enquiry)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                {enquiry.status === "new" && (
                  <Button
                    size="sm"
                    className="flex-1 lg:flex-none bg-sage-400 hover:bg-sage-500 text-white"
                    onClick={() => {
                      updateEnquiryStatus({ id: enquiry._id, status: "in-discussion" });
                      toast.success("Status updated to In Discussion");
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Create Order
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {enquiry.status === "new" && (
                      <DropdownMenuItem onClick={() => {
                        updateEnquiryStatus({ id: enquiry._id, status: "in-discussion" });
                        toast.success("Status updated");
                      }}>
                        <Clock className="h-4 w-4 mr-2" />
                        Mark In Discussion
                      </DropdownMenuItem>
                    )}
                    {enquiry.status === "in-discussion" && (
                      <DropdownMenuItem onClick={() => {
                        updateEnquiryStatus({ id: enquiry._id, status: "quoted" });
                        toast.success("Status updated");
                      }}>
                        <Clock className="h-4 w-4 mr-2" />
                        Mark Quoted
                      </DropdownMenuItem>
                    )}
                    {enquiry.status === "quoted" && (
                      <DropdownMenuItem onClick={() => {
                        updateEnquiryStatus({ id: enquiry._id, status: "accepted" });
                        toast.success("Status updated");
                      }}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Accepted
                      </DropdownMenuItem>
                    )}
                    {enquiry.status === "accepted" && (
                      <DropdownMenuItem onClick={() => {
                        updateEnquiryStatus({ id: enquiry._id, status: "in-progress" });
                        toast.success("Status updated");
                      }}>
                        <Clock className="h-4 w-4 mr-2" />
                        Mark In Progress
                      </DropdownMenuItem>
                    )}
                    {enquiry.status === "in-progress" && (
                      <DropdownMenuItem onClick={() => {
                        updateEnquiryStatus({ id: enquiry._id, status: "complete" });
                        toast.success("Status updated");
                      }}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Complete
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        updateEnquiryStatus({ id: enquiry._id, status: "cancelled" });
                        toast.success("Enquiry cancelled");
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-cream-200 flex items-center justify-between text-xs text-charcoal-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Received: {timeAgo(enquiry.createdAt)}
              </span>
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
        onOpenChange={() => setSelectedEnquiry(null)}
      >
        {selectedEnquiry && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enquiry Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-charcoal-400">Customer</p>
                  <p className="font-medium text-charcoal-700">
                    {selectedEnquiry.name}
                  </p>
                  <p className="text-sm text-charcoal-500">
                    {selectedEnquiry.email}
                  </p>
                  {selectedEnquiry.phone && (
                    <p className="text-sm text-charcoal-500">
                      {selectedEnquiry.phone}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-charcoal-400">Status</p>
                  <Badge className={statusConfig[selectedEnquiry.status]?.color ?? "bg-gray-100 text-gray-700"}>
                    {statusConfig[selectedEnquiry.status]?.label ?? selectedEnquiry.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-charcoal-400">Type</p>
                  <p className="text-charcoal-700">{selectedEnquiry.arrangementType}</p>
                </div>
                <div>
                  <p className="text-sm text-charcoal-400">Size</p>
                  <p className="text-charcoal-700">{selectedEnquiry.size}{selectedEnquiry.customSize ? ` (${selectedEnquiry.customSize})` : ""}</p>
                </div>
                <div>
                  <p className="text-sm text-charcoal-400">Budget</p>
                  <p className="text-charcoal-700">{selectedEnquiry.estimatedPrice ?? "Not specified"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-charcoal-400 mb-1">Colors</p>
                  <p className="text-charcoal-700">{selectedEnquiry.colourTheme}{selectedEnquiry.customColour ? ` - ${selectedEnquiry.customColour}` : ""}</p>
                </div>
                <div>
                  <p className="text-sm text-charcoal-400 mb-1">Occasion</p>
                  <p className="text-charcoal-700">{selectedEnquiry.occasion}</p>
                </div>
              </div>

              {selectedEnquiry.ribbon && (
                <div>
                  <p className="text-sm text-charcoal-400 mb-1">Ribbon</p>
                  <p className="text-charcoal-700">Yes{selectedEnquiry.ribbonColour ? ` - ${selectedEnquiry.ribbonColour}` : ""}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-charcoal-400 mb-1">Wreath Base</p>
                <p className="text-charcoal-700">{selectedEnquiry.wreathBase}</p>
              </div>

              {selectedEnquiry.notes && (
                <div>
                  <p className="text-sm text-charcoal-400 mb-1">Notes</p>
                  <p className="text-charcoal-700 whitespace-pre-wrap">
                    {selectedEnquiry.notes}
                  </p>
                </div>
              )}

              {selectedEnquiry.imageUrls && selectedEnquiry.imageUrls.length > 0 && (
                <div>
                  <p className="text-sm text-charcoal-400 mb-2">Inspiration Images</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedEnquiry.imageUrls.map((url: string, i: number) => (
                      <div key={i} className="w-24 h-24 rounded-md overflow-hidden bg-cream-200 relative">
                        <Image src={url} alt="Inspiration" fill className="object-cover" sizes="96px" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedEnquiry.status === "new" && (
                  <Button
                    className="bg-sage-400 hover:bg-sage-500 text-white"
                    onClick={() => {
                      updateEnquiryStatus({ id: selectedEnquiry._id, status: "in-discussion" });
                      toast.success("Status updated to In Discussion");
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Start Discussion
                  </Button>
                )}
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
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
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Quote Amount (£)</Label>
              <Input type="number" placeholder="75.00" className="mt-1" />
            </div>
            <div>
              <Label>Estimated Timeline</Label>
              <Input placeholder="1-2 weeks" className="mt-1" />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                placeholder="Thank you for your enquiry! I'd love to create this for you..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="bg-sage-400 hover:bg-sage-500 text-white">
                <Send className="h-4 w-4 mr-2" />
                Send Quote
              </Button>
              <Button variant="outline" onClick={() => setQuoteDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
