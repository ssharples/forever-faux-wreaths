"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductForm } from "@/components/forms/product-form";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useMutation(api.products.create);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createProduct({
        ...data.formData,
        images: data.imageIds as Id<"_storage">[],
        colours: data.colours,
        suitableFor: data.suitableFor,
        categoryId: data.categoryId as Id<"categories">,
      });
      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to create product");
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
        <h1 className="text-3xl text-charcoal-700">New Product</h1>
      </div>
      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
