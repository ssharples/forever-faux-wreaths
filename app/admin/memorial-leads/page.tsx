"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Clock,
  Eye,
  Loader2,
  Mail,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { timeAgo } from "@/lib/format-date";
import { toast } from "sonner";

type MemorialLead = Doc<"memorialLeads">;
type LeadType = MemorialLead["leadType"];
type LeadStatus = MemorialLead["status"];

const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Contacted", color: "bg-amber-100 text-amber-700" },
  converted: { label: "Converted", color: "bg-sage-100 text-sage-700" },
  archived: { label: "Archived", color: "bg-charcoal-100 text-charcoal-600" },
};

const statusTabs = ["all", "new", "contacted", "converted", "archived"] as const;
const editableStatuses = ["new", "contacted", "converted", "archived"] as const;

const requestedInfoLabels: Record<string, string> = {
  "wholesale-pricing": "Wholesale pricing",
  "minimum-order-quantities": "Minimum order quantities",
  "sample-availability": "Sample availability",
  "launch-dates": "Launch dates",
  "trade-packs": "Trade packs",
};

function leadTypeLabel(leadType: LeadType) {
  return leadType === "retail-waitlist" ? "Retail waitlist" : "Wholesale";
}

function interestLabel(interestType?: MemorialLead["interestType"]) {
  if (interestType === "early-access") return "Early access";
  return "Waiting list";
}

export default function MemorialLeadsPage() {
  const [leadType, setLeadType] = useState<LeadType>("retail-waitlist");
  const [statusFilter, setStatusFilter] = useState<(typeof statusTabs)[number]>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<MemorialLead | null>(null);
  const [dialogStatus, setDialogStatus] = useState<LeadStatus>("new");
  const [dialogNotes, setDialogNotes] = useState("");

  const allLeads = useQuery(api.memorialLeads.list, {});
  const updateLeadStatus = useMutation(api.memorialLeads.updateStatus);

  const leads = allLeads ?? [];

  const counts = useMemo(() => {
    const initial = {
      "retail-waitlist": 0,
      "wholesale-interest": 0,
      all: 0,
      new: 0,
      contacted: 0,
      converted: 0,
      archived: 0,
    };

    return leads.reduce((acc, lead) => {
      acc[lead.leadType] += 1;
      if (lead.leadType === leadType) {
        acc.all += 1;
        acc[lead.status] += 1;
      }
      return acc;
    }, initial);
  }, [leadType, leads]);

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    const fields = [
      lead.name,
      lead.email,
      lead.phone,
      lead.businessName,
      lead.businessType,
      lead.website,
      lead.message,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = fields.includes(query);
    const matchesLeadType = lead.leadType === leadType;
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesLeadType && matchesStatus;
  });

  useEffect(() => {
    if (!selectedLead) return;
    setDialogStatus(selectedLead.status);
    setDialogNotes(selectedLead.internalNotes ?? "");
  }, [selectedLead]);

  const updateStatus = async (lead: MemorialLead, status: LeadStatus) => {
    try {
      await updateLeadStatus({ id: lead._id, status });
      toast.success("Memorial lead updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update lead"
      );
    }
  };

  const saveSelectedLead = async () => {
    if (!selectedLead) return;
    try {
      await updateLeadStatus({
        id: selectedLead._id,
        status: dialogStatus,
        internalNotes: dialogNotes.trim() || undefined,
      });
      toast.success("Memorial lead saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save lead"
      );
    }
  };

  if (allLeads === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6 lg:p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
          <p className="text-charcoal-500">Loading Memorial Topper leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl text-charcoal-700 mb-1">
          Memorial Topper Leads
        </h1>
        <p className="text-charcoal-500">
          Manage waitlist and wholesale interest for the Forever Faux Memorial
          Topper.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="border-cream-300 bg-white p-5">
          <p className="text-sm text-charcoal-500">Retail waitlist</p>
          <p className="mt-2 font-display text-3xl text-charcoal-700">
            {counts["retail-waitlist"]}
          </p>
        </Card>
        <Card className="border-cream-300 bg-white p-5">
          <p className="text-sm text-charcoal-500">Wholesale interest</p>
          <p className="mt-2 font-display text-3xl text-charcoal-700">
            {counts["wholesale-interest"]}
          </p>
        </Card>
        <Card className="border-cream-300 bg-white p-5">
          <p className="text-sm text-charcoal-500">New in current tab</p>
          <p className="mt-2 font-display text-3xl text-charcoal-700">
            {counts.new}
          </p>
        </Card>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={leadType}
          onValueChange={(value) => {
            setLeadType(value as LeadType);
            setStatusFilter("all");
          }}
        >
          <TabsList className="bg-cream-200">
            <TabsTrigger value="retail-waitlist" className="data-[state=active]:bg-white">
              <UserRound className="mr-2 h-4 w-4" />
              Retail ({counts["retail-waitlist"]})
            </TabsTrigger>
            <TabsTrigger value="wholesale-interest" className="data-[state=active]:bg-white">
              <Building2 className="mr-2 h-4 w-4" />
              Wholesale ({counts["wholesale-interest"]})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusTabs.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={
                statusFilter === status
                  ? "bg-sage-400 text-white hover:bg-sage-500"
                  : "border-cream-300"
              }
            >
              {status === "all" ? "All" : statusConfig[status].label}
              <span className="ml-1.5 text-xs opacity-70">
                ({counts[status]})
              </span>
            </Button>
          ))}
        </div>
      </div>

      <Card className="mb-6 border-cream-300 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, email, business, or message..."
            className="pl-10"
          />
        </div>
      </Card>

      {filteredLeads.length === 0 ? (
        <Card className="border-cream-300 bg-white p-12 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-sage-300" />
          <h2 className="mt-4 text-xl text-charcoal-700">
            No Memorial Topper leads found
          </h2>
          <p className="mt-2 text-charcoal-500">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting the search or status filter."
              : `${leadTypeLabel(leadType)} leads will appear here as visitors submit the launch forms.`}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <Card
              key={lead._id}
              className="border-cream-300 bg-white p-5 transition-colors hover:border-sage-300"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-medium text-charcoal-700">
                      {lead.businessName ?? lead.name ?? lead.email}
                    </h2>
                    <Badge className={statusConfig[lead.status].color}>
                      {statusConfig[lead.status].label}
                    </Badge>
                    <Badge variant="secondary" className="bg-cream-200 text-charcoal-600">
                      {leadTypeLabel(lead.leadType)}
                    </Badge>
                  </div>

                  <div className="grid gap-2 text-sm text-charcoal-500 sm:grid-cols-2 xl:grid-cols-4">
                    <a
                      href={`mailto:${lead.email}`}
                      className="flex items-center gap-2 hover:text-sage-600"
                    >
                      <Mail className="h-4 w-4" />
                      {lead.email}
                    </a>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {timeAgo(lead.createdAt)}
                    </span>
                    {lead.leadType === "retail-waitlist" ? (
                      <span>{interestLabel(lead.interestType)}</span>
                    ) : (
                      <span>{lead.businessType ?? "Trade enquiry"}</span>
                    )}
                    {lead.phone && <span>{lead.phone}</span>}
                  </div>

                  {lead.requestedInfo.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lead.requestedInfo.map((item) => (
                        <Badge
                          key={item}
                          variant="secondary"
                          className="bg-sage-100 text-sage-700"
                        >
                          {requestedInfoLabels[item] ?? item}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {lead.message && (
                    <p className="mt-3 line-clamp-2 text-sm text-charcoal-500">
                      {lead.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 lg:flex-col">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 lg:flex-none"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Open actions for ${lead.email}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {editableStatuses.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => void updateStatus(lead, status)}
                        >
                          Mark {statusConfig[status].label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={selectedLead !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedLead(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Memorial Topper lead</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid gap-3 rounded-lg bg-cream-100 p-4 text-sm sm:grid-cols-2">
                <Detail label="Type" value={leadTypeLabel(selectedLead.leadType)} />
                <Detail label="Status" value={statusConfig[selectedLead.status].label} />
                <Detail label="Name" value={selectedLead.name ?? "Not provided"} />
                <Detail label="Email" value={selectedLead.email} />
                <Detail label="Phone" value={selectedLead.phone ?? "Not provided"} />
                <Detail
                  label="Submitted"
                  value={new Date(selectedLead.createdAt).toLocaleString("en-GB")}
                />
                {selectedLead.businessName && (
                  <Detail label="Business" value={selectedLead.businessName} />
                )}
                {selectedLead.businessType && (
                  <Detail label="Business type" value={selectedLead.businessType} />
                )}
                {selectedLead.website && (
                  <Detail label="Website" value={selectedLead.website} />
                )}
                {selectedLead.leadType === "retail-waitlist" && (
                  <Detail
                    label="Interest"
                    value={interestLabel(selectedLead.interestType)}
                  />
                )}
              </div>

              {selectedLead.requestedInfo.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-charcoal-700">
                    Requested information
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLead.requestedInfo.map((item) => (
                      <Badge
                        key={item}
                        variant="secondary"
                        className="bg-sage-100 text-sage-700"
                      >
                        {requestedInfoLabels[item] ?? item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedLead.message && (
                <div>
                  <p className="mb-2 text-sm font-medium text-charcoal-700">
                    Message
                  </p>
                  <p className="rounded-lg border border-cream-300 bg-white p-4 text-sm leading-relaxed text-charcoal-600">
                    {selectedLead.message}
                  </p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
                <div>
                  <Label htmlFor="memorial-lead-status">Status</Label>
                  <Select
                    value={dialogStatus}
                    onValueChange={(status: LeadStatus) => setDialogStatus(status)}
                  >
                    <SelectTrigger id="memorial-lead-status" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {editableStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusConfig[status].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="memorial-lead-notes">Internal notes</Label>
                  <Textarea
                    id="memorial-lead-notes"
                    value={dialogNotes}
                    onChange={(event) => setDialogNotes(event.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedLead(null)}>
                  Close
                </Button>
                <Button
                  className="bg-sage-400 text-white hover:bg-sage-500"
                  onClick={() => void saveSelectedLead()}
                >
                  Save lead
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-charcoal-400">{label}</p>
      <p className="mt-0.5 break-words font-medium text-charcoal-700">
        {value}
      </p>
    </div>
  );
}
