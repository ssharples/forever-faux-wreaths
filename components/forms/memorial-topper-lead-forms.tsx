"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { CheckCircle, Loader2, Mail, Send, Store } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const requestedInfoOptions = [
  { value: "wholesale-pricing", label: "Wholesale pricing" },
  { value: "minimum-order-quantities", label: "Minimum order quantities" },
  { value: "sample-availability", label: "Sample availability" },
  { value: "launch-dates", label: "Launch dates" },
  { value: "trade-packs", label: "Trade packs" },
] as const;

type RequestedInfo = (typeof requestedInfoOptions)[number]["value"];

const businessTypes = [
  "Funeral director",
  "Florist",
  "Garden centre",
  "Memorial supplier",
  "Online retailer",
  "Wholesaler",
];

export function MemorialTopperRetailForm() {
  const createLead = useMutation(api.memorialLeads.createRetailWaitlistLead);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interestType: "waiting-list" as "waiting-list" | "early-access",
    privacyConsent: false,
    marketingConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.privacyConsent) {
      toast.error("Please agree to the privacy policy to continue");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createLead({
        name: formData.name || undefined,
        email: formData.email,
        interestType: formData.interestType,
        privacyConsent: formData.privacyConsent,
        marketingConsent: formData.marketingConsent,
      });
      setSuccessMessage(result.message);
      setFormData({
        name: "",
        email: "",
        interestType: "waiting-list",
        privacyConsent: false,
        marketingConsent: false,
      });
      toast.success(result.message);
    } catch (error) {
      toast.error("Could not join the Memorial Topper list", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <Card className="border-sage-200 bg-sage-50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 text-sage-600" />
          <div>
            <p className="font-medium text-charcoal-700">{successMessage}</p>
            <p className="mt-1 text-sm text-charcoal-500">
              We will email you when launch details are ready.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="memorial-retail-name">Name</Label>
          <Input
            id="memorial-retail-name"
            autoComplete="name"
            value={formData.name}
            onChange={(event) =>
              setFormData({ ...formData, name: event.target.value })
            }
            className="mt-1 bg-white"
          />
        </div>
        <div>
          <Label htmlFor="memorial-retail-email">Email *</Label>
          <Input
            id="memorial-retail-email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(event) =>
              setFormData({ ...formData, email: event.target.value })
            }
            className="mt-1 bg-white"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="memorial-retail-interest">Interest</Label>
        <Select
          value={formData.interestType}
          onValueChange={(value: "waiting-list" | "early-access") =>
            setFormData({ ...formData, interestType: value })
          }
        >
          <SelectTrigger id="memorial-retail-interest" className="mt-1 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="waiting-list">Join the waiting list</SelectItem>
            <SelectItem value="early-access">Request early access</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ConsentCheckboxes
        idPrefix="memorial-retail"
        privacyConsent={formData.privacyConsent}
        marketingConsent={formData.marketingConsent}
        onPrivacyChange={(privacyConsent) =>
          setFormData({ ...formData, privacyConsent })
        }
        onMarketingChange={(marketingConsent) =>
          setFormData({ ...formData, marketingConsent })
        }
      />

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="min-h-12 w-full bg-sage-400 text-white hover:bg-sage-500"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining list
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Join Memorial Topper list
          </>
        )}
      </Button>
    </form>
  );
}

export function MemorialTopperWholesaleForm() {
  const createLead = useMutation(api.memorialLeads.createWholesaleInterestLead);
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    website: "",
    requestedInfo: [] as RequestedInfo[],
    message: "",
    privacyConsent: false,
    marketingConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleRequestedInfo = (value: RequestedInfo, checked: boolean) => {
    setFormData((current) => ({
      ...current,
      requestedInfo: checked
        ? [...current.requestedInfo, value]
        : current.requestedInfo.filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.privacyConsent) {
      toast.error("Please agree to the privacy policy to continue");
      return;
    }
    if (formData.requestedInfo.length === 0) {
      toast.error("Please select at least one trade information request");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createLead({
        businessName: formData.businessName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone || undefined,
        businessType: formData.businessType,
        website: formData.website || undefined,
        requestedInfo: formData.requestedInfo,
        message: formData.message || undefined,
        privacyConsent: formData.privacyConsent,
        marketingConsent: formData.marketingConsent,
      });
      setSuccessMessage(result.message);
      setFormData({
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        businessType: "",
        website: "",
        requestedInfo: [],
        message: "",
        privacyConsent: false,
        marketingConsent: false,
      });
      toast.success(result.message);
    } catch (error) {
      toast.error("Could not send wholesale enquiry", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <Card className="border-sage-200 bg-sage-50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 text-sage-600" />
          <div>
            <p className="font-medium text-charcoal-700">{successMessage}</p>
            <p className="mt-1 text-sm text-charcoal-500">
              We will reply with trade information as soon as it is available.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="memorial-wholesale-business">Business name *</Label>
          <Input
            id="memorial-wholesale-business"
            autoComplete="organization"
            required
            value={formData.businessName}
            onChange={(event) =>
              setFormData({ ...formData, businessName: event.target.value })
            }
            className="mt-1 bg-white"
          />
        </div>
        <div>
          <Label htmlFor="memorial-wholesale-contact">Contact name *</Label>
          <Input
            id="memorial-wholesale-contact"
            autoComplete="name"
            required
            value={formData.contactName}
            onChange={(event) =>
              setFormData({ ...formData, contactName: event.target.value })
            }
            className="mt-1 bg-white"
          />
        </div>
        <div>
          <Label htmlFor="memorial-wholesale-email">Email *</Label>
          <Input
            id="memorial-wholesale-email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(event) =>
              setFormData({ ...formData, email: event.target.value })
            }
            className="mt-1 bg-white"
          />
        </div>
        <div>
          <Label htmlFor="memorial-wholesale-phone">Phone</Label>
          <Input
            id="memorial-wholesale-phone"
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={(event) =>
              setFormData({ ...formData, phone: event.target.value })
            }
            className="mt-1 bg-white"
          />
        </div>
        <div>
          <Label htmlFor="memorial-wholesale-type">Business type *</Label>
          <Select
            value={formData.businessType}
            onValueChange={(businessType) =>
              setFormData({ ...formData, businessType })
            }
            required
          >
            <SelectTrigger id="memorial-wholesale-type" className="mt-1 bg-white">
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="memorial-wholesale-website">Website</Label>
          <Input
            id="memorial-wholesale-website"
            type="url"
            autoComplete="url"
            value={formData.website}
            onChange={(event) =>
              setFormData({ ...formData, website: event.target.value })
            }
            placeholder="https://"
            className="mt-1 bg-white"
          />
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-charcoal-700">
          What would you like to request? *
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {requestedInfoOptions.map((option) => (
            <label
              key={option.value}
              htmlFor={`memorial-wholesale-${option.value}`}
              className="flex min-h-11 items-center gap-3 rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-charcoal-600"
            >
              <Checkbox
                id={`memorial-wholesale-${option.value}`}
                checked={formData.requestedInfo.includes(option.value)}
                onCheckedChange={(checked) =>
                  toggleRequestedInfo(option.value, checked === true)
                }
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="memorial-wholesale-message">Message</Label>
        <Textarea
          id="memorial-wholesale-message"
          rows={4}
          value={formData.message}
          onChange={(event) =>
            setFormData({ ...formData, message: event.target.value })
          }
          placeholder="Tell us about your trade interest or launch needs."
          className="mt-1 bg-white"
        />
      </div>

      <ConsentCheckboxes
        idPrefix="memorial-wholesale"
        privacyConsent={formData.privacyConsent}
        marketingConsent={formData.marketingConsent}
        onPrivacyChange={(privacyConsent) =>
          setFormData({ ...formData, privacyConsent })
        }
        onMarketingChange={(marketingConsent) =>
          setFormData({ ...formData, marketingConsent })
        }
      />

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="min-h-12 w-full bg-sage-400 text-white hover:bg-sage-500"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending enquiry
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Request wholesale information
          </>
        )}
      </Button>
    </form>
  );
}

function ConsentCheckboxes({
  idPrefix,
  privacyConsent,
  marketingConsent,
  onPrivacyChange,
  onMarketingChange,
}: {
  idPrefix: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
  onPrivacyChange: (value: boolean) => void;
  onMarketingChange: (value: boolean) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Checkbox
          id={`${idPrefix}-privacy`}
          checked={privacyConsent}
          onCheckedChange={(checked) => onPrivacyChange(checked === true)}
        />
        <Label
          htmlFor={`${idPrefix}-privacy`}
          className="cursor-pointer text-sm leading-relaxed text-charcoal-500"
        >
          <span>
            I agree to the{" "}
            <Link href="/legal/privacy" className="text-sage-600 hover:underline">
              Privacy Policy
            </Link>{" "}
            and consent to Forever Faux Wreaths storing my details for this
            Memorial Topper enquiry.
          </span>
        </Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox
          id={`${idPrefix}-marketing`}
          checked={marketingConsent}
          onCheckedChange={(checked) => onMarketingChange(checked === true)}
        />
        <Label
          htmlFor={`${idPrefix}-marketing`}
          className="cursor-pointer text-sm leading-relaxed text-charcoal-500"
        >
          <span>
            I would like to receive product launch updates and related Forever Faux
            Wreaths news by email.
          </span>
        </Label>
      </div>
    </div>
  );
}

export function MemorialTopperWholesaleIntro() {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-cream-100 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100">
        <Store className="h-5 w-5 text-sage-600" />
      </div>
      <div>
        <p className="font-medium text-charcoal-700">
          Wholesale enquiries are open.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-charcoal-500">
          We welcome funeral directors, florists, garden centres, memorial
          suppliers, online retailers, and wholesalers expanding their memorial
          range.
        </p>
      </div>
    </div>
  );
}
