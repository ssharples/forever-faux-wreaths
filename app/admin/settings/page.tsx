"use client";

import { useState } from "react";
import { Save, Store, Truck, CreditCard, Bell, Palette, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Settings saved successfully");
    setIsSaving(false);
  };

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
                    <Label>Store Name</Label>
                    <Input
                      defaultValue="Forever Faux Wreaths"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      defaultValue="Info@foreverfauxwreaths.co.uk"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    defaultValue="Preston, Lancashire, UK"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Store Description</Label>
                  <Textarea
                    defaultValue="Handcrafted faux floral wreaths made with love. Ready-made designs and bespoke creations for your home."
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
                  <Switch />
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
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label>Banner Message</Label>
                  <Input
                    defaultValue="Christmas orders now open! Order by December 10th for guaranteed delivery."
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
                    <Switch defaultChecked />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Price (£)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue="4.99"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Delivery Time</Label>
                      <Input
                        defaultValue="3-5 working days"
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
                    <Switch defaultChecked />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Price (£)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue="7.99"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Delivery Time</Label>
                      <Input
                        defaultValue="3-5 working days"
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
                    <Switch defaultChecked />
                  </div>
                  <div>
                    <Label>Collection Address</Label>
                    <Input
                      defaultValue="Preston, Lancashire (exact address provided after order)"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-cream-300 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-5 w-5 text-sage-600" />
                <h2 className="text-lg font-medium text-charcoal-700">
                  Payment Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-charcoal-700">PayPal</p>
                    <p className="text-sm text-charcoal-500">
                      Accept PayPal and Pay Later
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-charcoal-700">SumUp</p>
                    <p className="text-sm text-charcoal-500">
                      Accept card payments
                    </p>
                  </div>
                  <Switch defaultChecked />
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
                <Switch defaultChecked />
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
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal-700">
                    Low Stock Alerts
                  </p>
                  <p className="text-sm text-charcoal-500">
                    Get notified when a product is running low
                  </p>
                </div>
                <Switch defaultChecked />
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
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal-700">
                    Contact Form Messages
                  </p>
                  <p className="text-sm text-charcoal-500">
                    Get notified when someone sends a message
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
