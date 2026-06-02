"use client";

import { useState, useEffect } from "react";
import { Save, Store, Truck, CreditCard, Bell, Palette, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const settings = useQuery(api.siteSettings.getAll, {});
  const setSetting = useMutation(api.siteSettings.set);

  const [storeName, setStoreName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [location, setLocation] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [holidayMode, setHolidayMode] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [smallDeliveryPrice, setSmallDeliveryPrice] = useState("4.99");
  const [largeDeliveryPrice, setLargeDeliveryPrice] = useState("7.99");
  const [smallDeliveryEnabled, setSmallDeliveryEnabled] = useState(true);
  const [largeDeliveryEnabled, setLargeDeliveryEnabled] = useState(true);
  const [collectionEnabled, setCollectionEnabled] = useState(true);
  const [smallDeliveryTime, setSmallDeliveryTime] = useState("1-2 weeks");
  const [largeDeliveryTime, setLargeDeliveryTime] = useState("1-2 weeks");
  const [collectionAddress, setCollectionAddress] = useState(
    "Preston, Lancashire (exact address provided after order)"
  );

  // Notification states
  const [notifyNewOrders, setNotifyNewOrders] = useState(true);
  const [notifyBespokeEnquiries, setNotifyBespokeEnquiries] = useState(true);
  const [notifyNewsletterSignups, setNotifyNewsletterSignups] = useState(false);
  const [notifyContactMessages, setNotifyContactMessages] = useState(true);
  const [notifyMemorialRetailWaitlist, setNotifyMemorialRetailWaitlist] = useState(true);
  const [notifyMemorialWholesaleInterest, setNotifyMemorialWholesaleInterest] = useState(true);

  // Initialize from settings
  useEffect(() => {
    if (!settings) return;
    setStoreName((settings.storeName as string) || "Forever Faux Wreaths");
    setContactEmail((settings.contactEmail as string) || "Info@foreverfauxwreaths.co.uk");
    setLocation((settings.location as string) || "Preston, Lancashire, UK");
    setStoreDescription((settings.storeDescription as string) || "");
    setHolidayMode(!!(settings.holidayMode));
    const banner = settings.seasonalBanner as { enabled?: boolean; text?: string } | undefined;
    setShowBanner(banner?.enabled ?? false);
    setBannerMessage(banner?.text ?? "");
    const delivery = settings.deliveryPrices as { small?: number; large?: number } | undefined;
    setSmallDeliveryPrice(String(delivery?.small ?? 4.99));
    setLargeDeliveryPrice(String(delivery?.large ?? 7.99));
    const deliveryOptions = settings.deliveryOptions as
      | {
          small?: { enabled?: boolean; time?: string };
          large?: { enabled?: boolean; time?: string };
          collection?: { enabled?: boolean; address?: string };
        }
      | undefined;
    setSmallDeliveryEnabled(deliveryOptions?.small?.enabled ?? true);
    setLargeDeliveryEnabled(deliveryOptions?.large?.enabled ?? true);
    setCollectionEnabled(deliveryOptions?.collection?.enabled ?? true);
    setSmallDeliveryTime(deliveryOptions?.small?.time ?? "1-2 weeks");
    setLargeDeliveryTime(deliveryOptions?.large?.time ?? "1-2 weeks");
    setCollectionAddress(
      deliveryOptions?.collection?.address ??
        "Preston, Lancashire (exact address provided after order)"
    );

    // Notification defaults are true unless explicitly set to false
    setNotifyNewOrders(settings.notifyNewOrders !== false);
    setNotifyBespokeEnquiries(settings.notifyBespokeEnquiries !== false);
    setNotifyNewsletterSignups(settings.notifyNewsletterSignups === true); // default false
    setNotifyContactMessages(settings.notifyContactMessages !== false);
    setNotifyMemorialRetailWaitlist(settings.notifyMemorialRetailWaitlist !== false);
    setNotifyMemorialWholesaleInterest(settings.notifyMemorialWholesaleInterest !== false);
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setSetting({ key: "storeName", value: storeName });
      await setSetting({ key: "contactEmail", value: contactEmail });
      await setSetting({ key: "location", value: location });
      await setSetting({ key: "storeDescription", value: storeDescription });
      await setSetting({ key: "holidayMode", value: holidayMode });
      await setSetting({ key: "seasonalBanner", value: { enabled: showBanner, text: bannerMessage } });
      await setSetting({ key: "deliveryPrices", value: { small: parseFloat(smallDeliveryPrice), large: parseFloat(largeDeliveryPrice), collection: 0 } });
      await setSetting({
        key: "deliveryOptions",
        value: {
          small: {
            enabled: smallDeliveryEnabled,
            time: smallDeliveryTime,
          },
          large: {
            enabled: largeDeliveryEnabled,
            time: largeDeliveryTime,
          },
          collection: {
            enabled: collectionEnabled,
            address: collectionAddress,
          },
        },
      });

      await setSetting({ key: "notifyNewOrders", value: notifyNewOrders });
      await setSetting({ key: "notifyBespokeEnquiries", value: notifyBespokeEnquiries });
      await setSetting({ key: "notifyNewsletterSignups", value: notifyNewsletterSignups });
      await setSetting({ key: "notifyContactMessages", value: notifyContactMessages });
      await setSetting({ key: "notifyMemorialRetailWaitlist", value: notifyMemorialRetailWaitlist });
      await setSetting({ key: "notifyMemorialWholesaleInterest", value: notifyMemorialWholesaleInterest });
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    }
    setIsSaving(false);
  };

  if (settings === undefined) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
          <p className="text-charcoal-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl text-charcoal-700 mb-1">Settings</h1>
          <p className="text-charcoal-500">Manage your store configuration</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-sage-400 hover:bg-sage-500 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-cream-200">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-white"
          >
            <Store className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="delivery"
            className="data-[state=active]:bg-white"
          >
            <Truck className="h-4 w-4 mr-2" />
            Delivery
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="space-y-6">
            <Card className="p-6 border-cream-300 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <Store className="h-5 w-5 text-sage-600" />
                <h2 className="text-lg font-medium text-charcoal-700">
                  Store Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="settings-store-name">Store Name</Label>
                    <Input
                      id="settings-store-name"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="settings-contact-email">Contact Email</Label>
                    <Input
                      id="settings-contact-email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="settings-location">Location</Label>
                  <Input
                    id="settings-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="settings-store-description">Store Description</Label>
                  <Textarea
                    id="settings-store-description"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-cream-300 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="h-5 w-5 text-sage-600" />
                <h2 className="text-lg font-medium text-charcoal-700">
                  Store Status
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-charcoal-700">
                      Holiday Mode
                    </p>
                    <p className="text-sm text-charcoal-500">
                      Temporarily disable new orders
                    </p>
                  </div>
                  <Switch
                    checked={holidayMode}
                    onCheckedChange={setHolidayMode}
                    aria-label="Enable holiday mode"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-charcoal-700">
                      Show Seasonal Banner
                    </p>
                    <p className="text-sm text-charcoal-500">
                      Display promotional banner on homepage
                    </p>
                  </div>
                  <Switch
                    checked={showBanner}
                    onCheckedChange={setShowBanner}
                    aria-label="Show seasonal banner"
                  />
                </div>

                <div>
                  <Label htmlFor="settings-banner-message">Banner Message</Label>
                  <Input
                    id="settings-banner-message"
                    value={bannerMessage}
                    onChange={(e) => setBannerMessage(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Delivery Settings */}
        <TabsContent value="delivery">
          <div className="space-y-6">
            <Card className="p-6 border-cream-300 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="h-5 w-5 text-sage-600" />
                <h2 className="text-lg font-medium text-charcoal-700">
                  Delivery Options
                </h2>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-cream-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-charcoal-700">
                        Small Items Delivery
                      </p>
                      <p className="text-sm text-charcoal-500">
                        Wreaths under 30cm
                      </p>
                    </div>
                    <Switch
                      checked={smallDeliveryEnabled}
                      onCheckedChange={setSmallDeliveryEnabled}
                      aria-label="Enable small item delivery"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="settings-small-delivery-price">Price (£)</Label>
                      <Input
                        id="settings-small-delivery-price"
                        type="number"
                        step="0.01"
                        value={smallDeliveryPrice}
                        onChange={(e) => setSmallDeliveryPrice(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="settings-small-delivery-time">Delivery Time</Label>
                      <Input
                        id="settings-small-delivery-time"
                        value={smallDeliveryTime}
                        onChange={(event) => setSmallDeliveryTime(event.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cream-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-charcoal-700">
                        Large Items Delivery
                      </p>
                      <p className="text-sm text-charcoal-500">
                        Wreaths 30cm and above
                      </p>
                    </div>
                    <Switch
                      checked={largeDeliveryEnabled}
                      onCheckedChange={setLargeDeliveryEnabled}
                      aria-label="Enable large item delivery"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="settings-large-delivery-price">Price (£)</Label>
                      <Input
                        id="settings-large-delivery-price"
                        type="number"
                        step="0.01"
                        value={largeDeliveryPrice}
                        onChange={(e) => setLargeDeliveryPrice(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="settings-large-delivery-time">Delivery Time</Label>
                      <Input
                        id="settings-large-delivery-time"
                        value={largeDeliveryTime}
                        onChange={(event) => setLargeDeliveryTime(event.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cream-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-charcoal-700">
                        Local Collection
                      </p>
                      <p className="text-sm text-charcoal-500">
                        Preston, Lancashire
                      </p>
                    </div>
                    <Switch
                      checked={collectionEnabled}
                      onCheckedChange={setCollectionEnabled}
                      aria-label="Enable local collection"
                    />
                  </div>
                  <div>
                    <Label htmlFor="settings-collection-address">Collection Address</Label>
                    <Input
                      id="settings-collection-address"
                      value={collectionAddress}
                      onChange={(event) => setCollectionAddress(event.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-cream-300 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-5 w-5 text-sage-600" />
                <h2 className="text-lg font-medium text-charcoal-700">Payment Settings</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-charcoal-700">Stripe</p>
                    <p className="text-sm text-charcoal-500">Secure card payments via Stripe Checkout</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
                <p className="text-xs text-charcoal-400">
                  Stripe is configured via environment variables in the Convex dashboard.
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="p-6 border-cream-300 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="h-5 w-5 text-sage-600" />
              <h2 className="text-lg font-medium text-charcoal-700">
                Email Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal-700">New Orders</p>
                  <p className="text-sm text-charcoal-500">
                    Get notified when a new order is placed
                  </p>
                </div>
                <Switch
                  checked={notifyNewOrders}
                  onCheckedChange={setNotifyNewOrders}
                  aria-label="Notify on new orders"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal-700">
                    Bespoke Enquiries
                  </p>
                  <p className="text-sm text-charcoal-500">
                    Get notified when someone submits an enquiry
                  </p>
                </div>
                <Switch
                  checked={notifyBespokeEnquiries}
                  onCheckedChange={setNotifyBespokeEnquiries}
                  aria-label="Notify on bespoke enquiries"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal-700">
                    Contact Messages
                  </p>
                  <p className="text-sm text-charcoal-500">
                    Get notified when someone sends the contact form
                  </p>
                </div>
                <Switch
                  checked={notifyContactMessages}
                  onCheckedChange={setNotifyContactMessages}
                  aria-label="Notify on contact messages"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-charcoal-700">
                    Memorial Topper Waitlist
                  </p>
                  <p className="text-sm text-charcoal-500">
                    Get notified when someone joins the Memorial Topper list
                  </p>
                </div>
                <Switch
                  checked={notifyMemorialRetailWaitlist}
                  onCheckedChange={setNotifyMemorialRetailWaitlist}
                  aria-label="Notify on Memorial Topper waitlist signups"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-charcoal-700">
                    Memorial Topper Wholesale
                  </p>
                  <p className="text-sm text-charcoal-500">
                    Get notified when a trade customer requests Memorial Topper
                    information
                  </p>
                </div>
                <Switch
                  checked={notifyMemorialWholesaleInterest}
                  onCheckedChange={setNotifyMemorialWholesaleInterest}
                  aria-label="Notify on Memorial Topper wholesale enquiries"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal-700">
                    Newsletter Signups
                  </p>
                  <p className="text-sm text-charcoal-500">
                    Get notified when someone joins your mailing list
                  </p>
                </div>
                <Switch
                  checked={notifyNewsletterSignups}
                  onCheckedChange={setNotifyNewsletterSignups}
                  aria-label="Notify on newsletter signups"
                />
              </div>

            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
