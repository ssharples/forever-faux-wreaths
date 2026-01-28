"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Sparkles,
  ArrowUpDown,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  draft: "bg-charcoal-100 text-charcoal-600",
  "sold-out": "bg-amber-100 text-amber-700",
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "sold-out">("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Id<"products"> | null>(null);

  // Fetch products from Convex
  const products = useQuery(api.products.list, 
    statusFilter === "all" ? {} : { status: statusFilter }
  );
  const categories = useQuery(api.categories.list);
  const removeProduct = useMutation(api.products.remove);
  const updateProduct = useMutation(api.products.update);

  const isLoading = products === undefined;

  // Filter products by search query
  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) ?? [];

  // Get category name by ID
  const getCategoryName = (categoryId: Id<"categories">) => {
    const category = categories?.find((c) => c._id === categoryId);
    return category?.name ?? "Unknown";
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p._id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await removeProduct({ id: productToDelete });
      toast.success("Product deleted successfully");
      setProductToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleBulkStatusUpdate = async (status: "active" | "draft" | "sold-out") => {
    try {
      await Promise.all(
        selectedProducts.map((id) =>
          updateProduct({ id: id as Id<"products">, status })
        )
      );
      toast.success(`${selectedProducts.length} product(s) updated to ${status}`);
      setSelectedProducts([]);
    } catch (error) {
      toast.error("Failed to update products");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedProducts.map((id) =>
          removeProduct({ id: id as Id<"products"> })
        )
      );
      toast.success(`${selectedProducts.length} product(s) deleted`);
      setSelectedProducts([]);
    } catch (error) {
      toast.error("Failed to delete products");
    }
  };

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

      {/* Filters */}
      <Card className="p-4 mb-6 border-cream-300 bg-white">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select 
            value={statusFilter} 
            onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sold-out">Sold Out</SelectItem>
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
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleBulkStatusUpdate("active")}
            >
              Set Active
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleBulkStatusUpdate("draft")}
            >
              Set Draft
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={handleBulkDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <Card className="border-cream-300 bg-white overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-sage-400 mx-auto mb-4" />
            <p className="text-charcoal-500">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={
                        selectedProducts.length === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                    <button className="flex items-center gap-1 hover:text-charcoal-800">
                      Product
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                    <button className="flex items-center gap-1 hover:text-charcoal-800">
                      Price
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal-600">
                    Category
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
                        checked={selectedProducts.includes(product._id)}
                        onCheckedChange={() => toggleSelect(product._id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-cream-200 shrink-0 overflow-hidden flex items-center justify-center">
                          {product.imageUrls && product.imageUrls[0] ? (
                            <Image
                              src={product.imageUrls[0]}
                              alt={product.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Sparkles className="h-5 w-5 text-sage-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal-700 line-clamp-1">
                            {product.title}
                          </p>
                          <p className="text-xs text-charcoal-400">
                            {product.size} · {product.sizeCategory}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[product.status]}>
                        {product.status === "sold-out" 
                          ? "Sold Out" 
                          : product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm ${
                          product.stock === 0
                            ? "text-red-500"
                            : product.stock <= 3
                            ? "text-amber-600"
                            : "text-charcoal-600"
                        }`}
                      >
                        {product.stock === 0 ? "Out of stock" : product.stock}
                      </span>
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
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/shop/${product.slug}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product._id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => {
                              setProductToDelete(product._id);
                              setDeleteDialogOpen(true);
                            }}
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
        )}

        {!isLoading && filteredProducts.length === 0 && (
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

      {/* Pagination */}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-charcoal-500">
          <span>
            Showing {filteredProducts.length} of {products?.length ?? 0} products
          </span>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
