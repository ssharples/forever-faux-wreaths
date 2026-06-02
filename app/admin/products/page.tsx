"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  Loader2,
  Hammer,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { toast } from "sonner";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  draft: "bg-charcoal-100 text-charcoal-600",
  "sold-out": "bg-amber-100 text-amber-700",
};

export default function ProductsPage() {
  const allProducts = useQuery(api.products.adminList, {});
  const categories = useQuery(api.categories.list, {});
  const removeProduct = useMutation(api.products.remove);
  const updateProduct = useMutation(api.products.update);
  const [deleteId, setDeleteId] = useState<Id<"products"> | null>(null);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<Id<"products">[]>([]);
  const [bulkCategoryId, setBulkCategoryId] = useState("none");

  const getCategoryName = (categoryId: string) => {
    return categories?.find((c) => c._id === categoryId)?.name ?? "\u2014";
  };

  const filteredProducts = (allProducts ?? []).filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || product.categoryId === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const summaryCards = [
    {
      label: "Total",
      value: (allProducts ?? []).length,
      tone: "text-charcoal-700 bg-cream-50",
    },
    {
      label: "Active",
      value: (allProducts ?? []).filter((product) => product.status === "active").length,
      tone: "text-green-700 bg-green-50",
    },
    {
      label: "Draft",
      value: (allProducts ?? []).filter((product) => product.status === "draft").length,
      tone: "text-charcoal-700 bg-charcoal-100",
    },
    {
      label: "Featured",
      value: (allProducts ?? []).filter((product) => product.featured).length,
      tone: "text-sage-700 bg-sage-50",
    },
  ];

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p._id));
    }
  };

  const toggleSelect = (id: Id<"products">) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const runBulkStatusUpdate = async (status: "active" | "draft" | "sold-out") => {
    setIsBulkUpdating(true);
    try {
      await Promise.all(
        selectedProducts.map((id) =>
          updateProduct({ id, status })
        )
      );
      setSelectedProducts([]);
      toast.success(
        status === "active"
          ? "Products set to active"
          : status === "sold-out"
            ? "Products marked sold out"
            : "Products set to draft"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update selected products"
      );
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const runBulkDelete = async () => {
    setIsBulkUpdating(true);
    try {
      await Promise.all(
        selectedProducts.map((id) => removeProduct({ id }))
      );
      setSelectedProducts([]);
      toast.success("Products deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete selected products"
      );
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const runBulkCategoryUpdate = async () => {
    if (bulkCategoryId === "none") {
      toast.error("Choose a category first");
      return;
    }

    setIsBulkUpdating(true);
    try {
      await Promise.all(
        selectedProducts.map((id) =>
          updateProduct({ id, categoryId: bulkCategoryId as Id<"categories"> })
        )
      );
      setSelectedProducts([]);
      setBulkCategoryId("none");
      toast.success("Product categories updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update categories"
      );
    } finally {
      setIsBulkUpdating(false);
    }
  };

  if (allProducts === undefined) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-sage-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl text-charcoal-700 mb-1">Products</h1>
          <p className="text-charcoal-500">
            Manage your wreath listings
          </p>
        </div>
        <Button asChild className="bg-sage-400 hover:bg-sage-500 text-white">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {summaryCards.map((card) => (
          <Card key={card.label} className="p-4 border-cream-300 bg-white">
            <p className="text-sm text-charcoal-500 mb-2">{card.label}</p>
            <p className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${card.tone}`}>
              {card.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6 border-cream-300 bg-white">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
            <Input
              aria-label="Search products"
              placeholder="Search by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full lg:w-[220px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {(categories ?? []).map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sold-out">Sold out</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="mb-4 p-3 bg-sage-50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-sage-700">
            {selectedProducts.length} product(s) selected
          </span>
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              disabled={isBulkUpdating}
              onClick={() => void runBulkStatusUpdate("active")}
            >
              Set Active
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isBulkUpdating}
              onClick={() => void runBulkStatusUpdate("draft")}
            >
              Set Draft
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isBulkUpdating}
              onClick={() => void runBulkStatusUpdate("sold-out")}
            >
              Mark Sold Out
            </Button>
            <Select value={bulkCategoryId} onValueChange={setBulkCategoryId}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Move to category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Move to category…</SelectItem>
                {(categories ?? []).map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              disabled={isBulkUpdating}
              onClick={() => void runBulkCategoryUpdate()}
            >
              Apply Category
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              disabled={isBulkUpdating}
              onClick={() => void runBulkDelete()}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <Card className="border-cream-300 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-50 border-b border-cream-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    aria-label="Select all products"
                    checked={
                      selectedProducts.length === filteredProducts.length &&
                      filteredProducts.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Fulfilment
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                  Quick Action
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-charcoal-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-cream-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      aria-label={`Select ${product.title}`}
                      checked={selectedProducts.includes(product._id)}
                      onCheckedChange={() => toggleSelect(product._id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-cream-200 overflow-hidden relative shrink-0">
                        {product.imageUrls?.[0] ? (
                          <Image src={product.imageUrls[0]} alt={product.title} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <Sparkles className="h-5 w-5 text-sage-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-charcoal-700 line-clamp-1">
                          {product.title}
                        </p>
                        <p className="text-xs text-charcoal-400">
                          {product.size}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={statusColors[product.status]}>
                      {product.status === "sold-out"
                        ? "Sold out"
                        : product.status.charAt(0).toUpperCase() +
                          product.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-sage-100 text-sage-700">
                      <Hammer className="mr-1 h-3 w-3" />
                      Made to order
                    </Badge>
                    <p className="mt-1 text-xs text-charcoal-500">
                      1-2 week lead time
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-charcoal-700">
                      £{product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-charcoal-600">
                      {getCategoryName(product.categoryId)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {product.status === "draft" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          void updateProduct({ id: product._id, status: "active" })
                            .then(() => {
                              toast.success("Product published");
                            })
                            .catch((error) => {
                              toast.error(
                                error instanceof Error
                                  ? error.message
                                  : "Failed to update product"
                              );
                            })
                        }
                      >
                        Publish
                      </Button>
                    ) : product.status === "sold-out" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          void updateProduct({ id: product._id, status: "active" })
                            .then(() => {
                              toast.success("Product restored to active");
                            })
                            .catch((error) => {
                              toast.error(
                                error instanceof Error
                                  ? error.message
                                  : "Failed to update product"
                              );
                            })
                        }
                      >
                        Restore
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          void updateProduct({ id: product._id, status: "draft" })
                            .then(() => {
                              toast.success("Product moved to draft");
                            })
                            .catch((error) => {
                              toast.error(
                                error instanceof Error
                                  ? error.message
                                  : "Failed to update product"
                              );
                            })
                        }
                      >
                        Move to draft
                      </Button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="min-h-[44px] min-w-[44px]"
                          aria-label={`Open actions for ${product.title}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/shop/${product.slug}`} className="min-h-[44px]">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product._id}`} className="min-h-[44px]">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="min-h-[44px] text-destructive"
                          onClick={() => setDeleteId(product._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-sage-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-charcoal-700 mb-2">
              No products found
            </h3>
            <p className="text-charcoal-500 mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first product"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button asChild className="bg-sage-400 hover:bg-sage-500 text-white">
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              disabled={isDeleting}
              onClick={async () => {
                if (deleteId) {
                  setIsDeleting(true);
                  try {
                    await removeProduct({ id: deleteId });
                    toast.success("Product deleted");
                    setDeleteId(null);
                  } catch (error) {
                    toast.error(
                      error instanceof Error ? error.message : "Failed to delete product"
                    );
                  } finally {
                    setIsDeleting(false);
                  }
                }
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {filteredProducts.length > 0 && (
        <div className="mt-4 text-sm text-charcoal-500">
          Showing {filteredProducts.length} of {(allProducts ?? []).length} products
        </div>
      )}
    </div>
  );
}
