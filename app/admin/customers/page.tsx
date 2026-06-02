"use client";

import { useState } from "react";
import { Search, Users, ShoppingBag, Mail, Calendar, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { timeAgo } from "@/lib/format-date";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const orders = useQuery(api.orders.list, {});
  const subscribers = useQuery(api.newsletterSubscribers.list, {});

  if (orders === undefined || subscribers === undefined) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
          <p className="text-charcoal-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  // Derive unique customers from orders
  const customerMap = new Map<
    string,
    {
      email: string;
      name: string;
      orderCount: number;
      totalSpend: number;
      lastOrderAt: number;
    }
  >();

  for (const order of orders) {
    const existing = customerMap.get(order.customerEmail);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpend += order.total;
      if (order.createdAt > existing.lastOrderAt) {
        existing.lastOrderAt = order.createdAt;
      }
    } else {
      customerMap.set(order.customerEmail, {
        email: order.customerEmail,
        name: order.customerName,
        orderCount: 1,
        totalSpend: order.total,
        lastOrderAt: order.createdAt,
      });
    }
  }

  const customers = Array.from(customerMap.values()).sort(
    (a, b) => b.lastOrderAt - a.lastOrderAt
  );

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpend, 0);
  const repeatCustomers = customers.filter((c) => c.orderCount > 1).length;
  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl text-charcoal-700 mb-1">Customers</h1>
        <p className="text-charcoal-500">
          View all customers derived from order history
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 border-cream-300 bg-white flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5 text-sage-600" />
          </div>
          <div>
            <p className="text-sm text-charcoal-500">Total Customers</p>
            <p className="text-2xl font-display text-charcoal-700">
              {customers.length}
            </p>
          </div>
        </Card>
        <Card className="p-5 border-cream-300 bg-white flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center shrink-0">
            <ShoppingBag className="h-5 w-5 text-sage-600" />
          </div>
          <div>
            <p className="text-sm text-charcoal-500">Repeat Customers</p>
            <p className="text-2xl font-display text-charcoal-700">
              {repeatCustomers}
            </p>
          </div>
        </Card>
        <Card className="p-5 border-cream-300 bg-white flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center shrink-0">
            <span className="text-sage-600 font-semibold text-sm">£</span>
          </div>
          <div>
            <p className="text-sm text-charcoal-500">Total Revenue</p>
            <p className="text-2xl font-display text-charcoal-700">
              £{totalRevenue.toFixed(2)}
            </p>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6 border-cream-300 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList className="bg-cream-200">
          <TabsTrigger value="customers" className="data-[state=active]:bg-white">
            Customers
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="data-[state=active]:bg-white">
            Newsletter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <Card className="border-cream-300 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-200 bg-cream-50">
                    <th className="text-left px-4 py-3 text-charcoal-500 font-medium">Customer</th>
                    <th className="text-left px-4 py-3 text-charcoal-500 font-medium hidden sm:table-cell">Email</th>
                    <th className="text-center px-4 py-3 text-charcoal-500 font-medium">Orders</th>
                    <th className="text-right px-4 py-3 text-charcoal-500 font-medium">Total Spend</th>
                    <th className="text-right px-4 py-3 text-charcoal-500 font-medium hidden md:table-cell">Last Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {filtered.map((customer) => (
                    <tr key={customer.email} className="hover:bg-cream-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center shrink-0">
                            <span className="text-sm font-medium text-sage-600">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-charcoal-700">{customer.name}</p>
                            <p className="text-xs text-charcoal-400 sm:hidden">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <a
                          href={`mailto:${customer.email}`}
                          className="flex items-center gap-1.5 text-charcoal-500 hover:text-sage-600 transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {customer.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          className={
                            customer.orderCount > 1
                              ? "bg-sage-100 text-sage-700"
                              : "bg-cream-100 text-charcoal-600"
                          }
                        >
                          {customer.orderCount}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-charcoal-700">
                        £{customer.totalSpend.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-charcoal-500 hidden md:table-cell">
                        <span className="flex items-center justify-end gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {timeAgo(customer.lastOrderAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="h-10 w-10 text-sage-300 mx-auto mb-3" />
                  <p className="text-charcoal-500">
                    {searchQuery
                      ? "No customers match your search"
                      : "No customers yet — they will appear once orders are placed"}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter">
          <Card className="border-cream-300 bg-white overflow-hidden">
            <div className="divide-y divide-cream-100">
              {filteredSubscribers.map((subscriber) => (
                <div
                  key={subscriber._id}
                  className="px-4 py-4 flex items-center justify-between hover:bg-cream-50 transition-colors"
                >
                  <a
                    href={`mailto:${subscriber.email}`}
                    className="flex items-center gap-2 text-charcoal-600 hover:text-sage-600"
                  >
                    <Mail className="h-4 w-4" />
                    {subscriber.email}
                  </a>
                  <span className="text-sm text-charcoal-400">
                    {timeAgo(subscriber.subscribedAt)}
                  </span>
                </div>
              ))}
              {filteredSubscribers.length === 0 && (
                <div className="p-12 text-center">
                  <Mail className="h-10 w-10 text-sage-300 mx-auto mb-3" />
                  <p className="text-charcoal-500">
                    {searchQuery
                      ? "No subscribers match your search"
                      : "No newsletter signups yet"}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
