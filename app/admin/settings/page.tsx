"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Save, Store, Truck, Bell, Palette, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface StoreInfo {
  name: string;
  email: string;
  location: string;
  description: string;
}

interface SeasonalBanner {
  enabled: boolean;
  text: string;
}

interface DeliveryPrices {
  small: number;
  large: number;
  smallTime: string;
  largeTime: string;
  collectionAddress: string;
}

interface Notifications {
  newOrders: boolean;
  bespokeEnquiries: boolean;
  lowStock: boolean;
  newsletter: boolean;
  contactForm: boolean;
}

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [holidayMode, setHolidayMode] = useState(false);

  // Form state
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: "Forever Faux Wreaths",
    email: "Info@foreverfauxwreaths.co.uk",
    location: "Preston, Lancashire, UK",
    description: "Handcrafted faux floral wreaths made with love. Ready-made designs and bespoke creations for your home.",
  });

  const [seasonalBanner, setSeasonalBanner] = useState<SeasonalBanner>({
    enabled: false,
    text: "",
  });

  const [deliveryPrices, setDeliveryPrices] = useState<DeliveryPrices>({
    small: 4.99,
    large: 7.99,
    smallTime: "3-5 working days",
    largeTime: "3-5 working days",
    collectionAddress: "Preston, Lancashire (exact address provided after order)",
  });

  const [notifications, setNotifications] = useState<Notifications>({
    newOrders: true,
    bespokeEnquiries: true,
    lowStock: true,
    newsletter: false,
    contactForm: true,
  });

  // Convex
  const settings = useQuery(api.siteSettings.getAll);
  const setSetting = useMutation(api.siteSettings.set);

  const isLoading = settings === undefined;

  // Load settings from Convex
  useEffect(() => {
    if (settings) {
      if (settings.storeInfo) {
        setStoreInfo(settings.storeInfo as StoreInfo);
      }
      if (settings.seasonalBanner) {
        setSeasonalBanner(settings.seasonalBanner as SeasonalBanner);
      }
      if (settings.deliveryPrices) {
        setDeliveryPrices(settings.deliveryPrices as DeliveryPrices);
      }
      if (settings.notifications) {
        setNotifications(settings.notifications as Notifications);
      }
      if (settings.holidayMode !== undefined) {
        setHolidayMode(settings.holidayMode as boolean);
      }
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        setSetting({ key: "storeInfo", value: storeInfo }),
        setSetting({ key: "seasonalBanner", value: seasonalBanner }),
        setSetting({ key: "deliveryPrices", value: deliveryPrices }),
        setSetting({ key: "notifications", value: notifications }),
        setSetting({ key: "holidayMode", value: holidayMode }),
      ]);
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-sage-400" />
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
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-cream-200">
          <TabsTrigger value="general" className="data-[state=active]:bg-white">
            <Store className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="delivery" className="data-[state=active]:bg-white">
            <Truck className="h-4 w-4 mr-2" />
            Delivery
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white">
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
                    <Label>Store Name</Label>
                    <Input
                      value={storeInfo.name}
                      onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={storeInfo.email}
                      onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    value={storeInfo.location}
                    onChange={(e) => setStoreInfo({ ...storeInfo, location: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Store Description</Label>
                  <Textarea
                    value={storeInfo.description}
                    onChange={(e) => setStoreInfo({ ...storeInfo, description: e.target.value })}
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
                    <p className="font-medium text-charcoal-700">Holiday Mode</p>
                    <p className="text-sm text-charcoal-500">
                      Temporarily disable new orders
                    </p>
                  </div>
                  <Switch
                    checked={holidayMode}
                    onCheckedChange={setHolidayMode}
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
                    checked={seasonalBanner.enabled}
                    onCheckedChange={(checked) =>
                      setSeasonalBanner({ ...seasonalBanner, enabled: checked })
                    }
                  />
                </div>

                {seasonalBanner.enabled && (
                  <div>
                    <Label>Banner Message</Label>
                    <Input
                      value={seasonalBanner.text}
                      onChange={(e) =>
                        setSeasonalBanner({ ...seasonalBanner, text: e.target.value })
                      }
                      placeholder="e.g., Christmas orders now open!"
                      className="mt-1"
                    />
                  </div>
                )}
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
                  <p className="font-medium text-charcoal-700 mb-4">
                    Small Items Delivery
                  </p>
                  <p className="text-sm text-charcoal-500 mb-4">
                    Wreaths under 30cm
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Price (£)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={deliveryPrices.small}
                        onChange={(e) =>
                          setDeliveryPrices({
                            ...deliveryPrices,
                            small: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Delivery Time</Label>
                      <Input
                        value={deliveryPrices.smallTime}
                        onChange={(e) =>
                          setDeliveryPrices({
                            ...deliveryPrices,
                            smallTime: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cream-50 rounded-lg">
                  <p className="font-medium text-charcoal-700 mb-4">
                    Large Items Delivery
                  </p>
                  <p className="text-sm text-charcoal-500 mb-4">
                    Wreaths 30cm and above
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Price (£)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={deliveryPrices.large}
                        onChange={(e) =>
                          setDeliveryPrices({
                            ...deliveryPrices,
                            large: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Delivery Time</Label>
                      <Input
                        value={deliveryPrices.largeTime}
                        onChange={(e) =>
                          setDeliveryPrices({
                            ...deliveryPrices,
                            largeTime: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cream-50 rounded-lg">
                  <p className="font-medium text-charcoal-700 mb-4">
                    Local Collection
                  </p>
                  <p className="text-sm text-charcoal-500 mb-4">Free</p>
                  <div>
                    <Label>Collection Address Info</Label>
                    <Input
                      value={deliveryPrices.collectionAddress}
                      onChange={(e) =>
                        setDeliveryPrices({
                          ...deliveryPrices,
                          collectionAddress: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
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
                  checked={notifications.newOrders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, newOrders: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal-700">Bespoke Enquiries</p>
                  <p className="text-sm text-charcoal-500">
                    Get notified when someone submits an enquiry
                  </p>
                </div>
                <Switch
                  checked={notifications.bespokeEnquiries}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, bespokeEnquiries: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal-700">Low Stock Alerts</p>
                  <p className="text-sm text-charcoal-500">
                    Get notified when a product is running low
                  </p>
                </div>
                <Switch
                  checked={notifications.lowStock}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, lowStock: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal-700">Newsletter Signups</p>
                  <p className="text-sm text-charcoal-500">
                    Get notified when someone joins your mailing list
                  </p>
                </div>
                <Switch
                  checked={notifications.newsletter}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, newsletter: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal-700">Contact Form Messages</p>
                  <p className="text-sm text-charcoal-500">
                    Get notified when someone sends a message
                  </p>
                </div>
                <Switch
                  checked={notifications.contactForm}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, contactForm: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
