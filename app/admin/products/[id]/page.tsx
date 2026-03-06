"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductForm } from "@/components/forms/product-form";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const product = useQuery(api.products.getById, { id: productId as Id<"products"> });
  const updateProduct = useMutation(api.products.update);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (product === undefined) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-sage-400 animate-spin" />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="p-6 lg:p-8 text-center">
        <h2 className="text-2xl text-charcoal-600 mb-4">Product not found</h2>
        <Link href="/admin/products" className="text-sage-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleSubmit = async (data: {
    formData: {
      title: string;
      slug: string;
      price: number;
      description: string;
      size: string;
      sizeCategory: "small" | "large";
      style: "classic" | "modern" | "rustic" | "seasonal" | "memorial";
      stock: number;
      status: "active" | "draft" | "sold-out";
      featured: boolean;
    };
    imageIds: string[];
    colours: string[];
    suitableFor: string[];
    categoryId: string;
  }) => {
    setIsSubmitting(true);
    try {
      await updateProduct({
        id: productId as Id<"products">,
        ...data.formData,
        images: data.imageIds as Id<"_storage">[],
        colours: data.colours,
        suitableFor: data.suitableFor,
        categoryId: data.categoryId as Id<"categories">,
      });
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to update product");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-sm text-charcoal-500 hover:text-sage-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
        <h1 className="text-3xl text-charcoal-700">Edit Product</h1>
      </div>
      <ProductForm
        initialData={{
          title: product.title,
          slug: product.slug,
          price: product.price,
          description: product.description,
          size: product.size,
          sizeCategory: product.sizeCategory,
          style: product.style,
          stock: product.stock,
          status: product.status,
          featured: product.featured,
          colours: product.colours,
          suitableFor: product.suitableFor,
          categoryId: product.categoryId,
        }}
        existingImageUrls={product.imageUrls}
        existingImageIds={product.images}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
