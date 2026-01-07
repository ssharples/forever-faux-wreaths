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
  Sparkles,
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

// Placeholder enquiries data
const enquiries = [
  {
    id: "ENQ-0056",
    name: "Michelle White",
    email: "michelle.w@email.com",
    type: "Memorial Wreath",
    size: "40cm",
    colors: "Pink, White, Silver",
    message:
      "I'd like a memorial wreath for my grandmother's grave. She loved pink roses and white lilies. Can you include a ribbon with 'Forever Loved' written on it?",
    budget: "£70-85",
    status: "new",
    date: "2024-11-15 15:45",
    images: [],
  },
  {
    id: "ENQ-0055",
    name: "Amanda Davis",
    email: "amanda.d@email.com",
    type: "Wedding Collection",
    size: "Multiple",
    colors: "Dusty pink, Sage green, Cream",
    message:
      "Planning my wedding for next June. Need a bridal bouquet, 3 bridesmaid bouquets, and 2 large arrangements for the venue. Rustic, garden style theme.",
    budget: "£300-400",
    status: "quoted",
    date: "2024-11-15 11:20",
    images: ["inspiration1.jpg"],
  },
  {
    id: "ENQ-0054",
    name: "Lisa Harrison",
    email: "lisa.h@email.com",
    type: "Custom Door Wreath",
    size: "50cm",
    colors: "Autumn colors - oranges, reds, burgundy",
    message:
      "Looking for a large autumn wreath for my front door. Love the rustic farmhouse style with lots of texture.",
    budget: "£85-100",
    status: "in_progress",
    date: "2024-11-14 09:30",
    images: ["autumn-inspo.jpg", "door-photo.jpg"],
  },
  {
    id: "ENQ-0053",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    type: "Christmas Wreath",
    size: "40cm",
    colors: "Traditional - red, green, gold",
    message:
      "Want a classic Christmas wreath with berries, pinecones, and a red velvet bow. Needs to be ready by December 1st.",
    budget: "£65-75",
    status: "completed",
    date: "2024-11-10 14:15",
    images: [],
  },
  {
    id: "ENQ-0052",
    name: "Emma Brown",
    email: "emma.b@email.com",
    type: "Spring Wreath",
    size: "30cm",
    colors: "Pastel - lavender, soft pink, mint",
    message:
      "Looking for something feminine and springy for my daughter's bedroom door.",
    budget: "£50-60",
    status: "declined",
    date: "2024-11-08 10:00",
    images: [],
  },
];

const statusConfig: Record<
  string,
  { color: string; label: string }
> = {
  new: { color: "bg-blue-100 text-blue-700", label: "New" },
  quoted: { color: "bg-purple-100 text-purple-700", label: "Quoted" },
  in_progress: { color: "bg-amber-100 text-amber-700", label: "In Progress" },
  completed: { color: "bg-green-100 text-green-700", label: "Completed" },
  declined: { color: "bg-red-100 text-red-700", label: "Declined" },
};

export default function EnquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<typeof enquiries[0] | null>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: enquiries.length,
      new: 0,
      quoted: 0,
      in_progress: 0,
      completed: 0,
      declined: 0,
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
        {["all", "new", "quoted", "in_progress", "completed"].map((status) => (
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
              : status === "in_progress"
              ? "In Progress"
              : status.charAt(0).toUpperCase() + status.slice(1)}
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
            placeholder="Search by ID, name, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Enquiries List */}
      <div className="space-y-4">
        {filteredEnquiries.map((enquiry) => (
          <Card
            key={enquiry.id}
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
                  </div>
                  <span className="text-xs text-charcoal-400 shrink-0">
                    {enquiry.id}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-charcoal-400">Type:</span>{" "}
                    <span className="text-charcoal-600">{enquiry.type}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-400">Size:</span>{" "}
                    <span className="text-charcoal-600">{enquiry.size}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-400">Budget:</span>{" "}
                    <span className="text-charcoal-600">{enquiry.budget}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-charcoal-400 mb-1">Colors:</p>
                  <p className="text-sm text-charcoal-600">{enquiry.colors}</p>
                </div>

                <div>
                  <p className="text-sm text-charcoal-400 mb-1">Message:</p>
                  <p className="text-sm text-charcoal-600 line-clamp-2">
                    {enquiry.message}
                  </p>
                </div>

                {enquiry.images.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-sage-500" />
                    <span className="text-sm text-sage-600">
                      {enquiry.images.length} inspiration image(s) attached
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
                      setSelectedEnquiry(enquiry);
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
                    <DropdownMenuItem>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Create Order
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {enquiry.status === "quoted" && (
                      <DropdownMenuItem>
                        <Clock className="h-4 w-4 mr-2" />
                        Mark In Progress
                      </DropdownMenuItem>
                    )}
                    {enquiry.status === "in_progress" && (
                      <DropdownMenuItem>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Complete
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-cream-200 flex items-center justify-between text-xs text-charcoal-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Received: {enquiry.date}
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

      {/* View Enquiry Dialog */}
      <Dialog
        open={!!selectedEnquiry && !quoteDialogOpen}
        onOpenChange={() => setSelectedEnquiry(null)}
      >
        {selectedEnquiry && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enquiry {selectedEnquiry.id}</DialogTitle>
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
                </div>
                <div>
                  <p className="text-sm text-charcoal-400">Status</p>
                  <Badge className={statusConfig[selectedEnquiry.status].color}>
                    {statusConfig[selectedEnquiry.status].label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-charcoal-400">Type</p>
                  <p className="text-charcoal-700">{selectedEnquiry.type}</p>
                </div>
                <div>
                  <p className="text-sm text-charcoal-400">Size</p>
                  <p className="text-charcoal-700">{selectedEnquiry.size}</p>
                </div>
                <div>
                  <p className="text-sm text-charcoal-400">Budget</p>
                  <p className="text-charcoal-700">{selectedEnquiry.budget}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-charcoal-400 mb-1">Colors</p>
                <p className="text-charcoal-700">{selectedEnquiry.colors}</p>
              </div>

              <div>
                <p className="text-sm text-charcoal-400 mb-1">Message</p>
                <p className="text-charcoal-700 whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                {selectedEnquiry.status === "new" && (
                  <Button
                    className="bg-sage-400 hover:bg-sage-500 text-white"
                    onClick={() => setQuoteDialogOpen(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Quote
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
