"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  size: z.string().min(1, "Size is required"),
  colours: z.string().min(1, "At least one colour is required"),
  style: z.enum(["classic", "modern", "rustic", "seasonal", "memorial"]),
  suitableFor: z.string().min(1, "At least one suitable occasion is required"),
  stock: z.number().int().min(0, "Stock must be 0 or greater"),
  categoryId: z.string().min(1, "Category is required"),
  featured: z.boolean(),
  sizeCategory: z.enum(["small", "large"]),
  status: z.enum(["active", "draft", "sold-out"]),
});

type ProductFormData = z.infer<typeof productSchema>;

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as Id<"products">;

  const [existingImages, setExistingImages] = useState<{ storageId: Id<"_storage">; url: string }[]>([]);
  const [newImages, setNewImages] = useState<{ file: File; preview: string; storageId?: Id<"_storage"> }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const product = useQuery(api.products.getById, { id: productId });
  const categories = useQuery(api.categories.list);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: 0,
      description: "",
      size: "",
      colours: "",
      style: "classic",
      suitableFor: "",
      stock: 0,
      categoryId: "",
      featured: false,
      sizeCategory: "small",
      status: "draft",
    },
  });

  // Populate form when product loads
  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        price: product.price,
        description: product.description,
        size: product.size,
        colours: product.colours.join(", "),
        style: product.style,
        suitableFor: product.suitableFor.join(", "),
        stock: product.stock,
        categoryId: product.categoryId,
        featured: product.featured,
        sizeCategory: product.sizeCategory,
        status: product.status,
      });

      // Set existing images
      if (product.imageUrls) {
        setExistingImages(
          product.images.map((storageId, index) => ({
            storageId,
            url: product.imageUrls[index] || "",
          })).filter((img) => img.url)
        );
      }
    }
  }, [product, reset]);

  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedImages: typeof newImages = [];

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        const preview = URL.createObjectURL(file);
        const uploadUrl = await generateUploadUrl();
        
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { storageId } = await result.json();
        uploadedImages.push({ file, preview, storageId });
      }

      setNewImages((prev) => [...prev, ...uploadedImages]);
      toast.success(`${uploadedImages.length} image(s) uploaded`);
    } catch (error) {
      toast.error("Failed to upload images");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }, [generateUploadUrl]);

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => {
      const images = [...prev];
      URL.revokeObjectURL(images[index].preview);
      images.splice(index, 1);
      return images;
    });
  };

  const onSubmit = async (data: ProductFormData) => {
    const allImages = [
      ...existingImages.map((img) => img.storageId),
      ...newImages.map((img) => img.storageId).filter((id): id is Id<"_storage"> => id !== undefined),
    ];

    if (allImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const slug = generateSlug(data.title);

      await updateProduct({
        id: productId,
        title: data.title,
        slug,
        price: data.price,
        description: data.description,
        images: allImages,
        size: data.size,
        colours: data.colours.split(",").map((c) => c.trim()),
        style: data.style,
        suitableFor: data.suitableFor.split(",").map((s) => s.trim()),
        stock: data.stock,
        categoryId: data.categoryId as Id<"categories">,
        featured: data.featured,
        sizeCategory: data.sizeCategory,
        status: data.status,
      });

      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeProduct({ id: productId });
      toast.success("Product deleted");
      router.push("/admin/products");
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (product === undefined) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-sage-400" />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="p-12 text-center border-cream-300 bg-white">
          <h2 className="text-xl text-charcoal-700 mb-2">Product Not Found</h2>
          <p className="text-charcoal-500 mb-4">This product may have been deleted.</p>
          <Button asChild variant="outline">
            <Link href="/admin/products">Back to Products</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center text-sm text-charcoal-500 hover:text-sage-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
          <h1 className="text-3xl text-charcoal-700">Edit Product</h1>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &ldquo;{product.title}&rdquo;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Images */}
        <Card className="p-6 border-cream-300 bg-white">
          <h2 className="text-lg font-medium text-charcoal-700 mb-4">Images</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {/* Existing images */}
            {existingImages.map((img, index) => (
              <div
                key={`existing-${index}`}
                className="relative aspect-square rounded-lg overflow-hidden border border-cream-300 group"
              >
                <Image
                  src={img.url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-2 right-2 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-charcoal-600" />
                </button>
                {index === 0 && newImages.length === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-sage-500 text-white text-xs rounded">
                    Main
                  </span>
                )}
              </div>
            ))}

            {/* New images */}
            {newImages.map((img, index) => (
              <div
                key={`new-${index}`}
                className="relative aspect-square rounded-lg overflow-hidden border border-cream-300 group"
              >
                <Image
                  src={img.preview}
                  alt={`New image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-2 right-2 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-charcoal-600" />
                </button>
                {index === 0 && existingImages.length === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-sage-500 text-white text-xs rounded">
                    Main
                  </span>
                )}
              </div>
            ))}

            {/* Upload Button */}
            <label className="aspect-square rounded-lg border-2 border-dashed border-cream-400 hover:border-sage-400 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
                disabled={isUploading}
              />
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-sage-400 animate-spin" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-charcoal-400 mb-2" />
                  <span className="text-sm text-charcoal-500">Add Images</span>
                </>
              )}
            </label>
          </div>

          <p className="text-sm text-charcoal-400">
            First image will be the main product image.
          </p>
        </Card>

        {/* Basic Info */}
        <Card className="p-6 border-cream-300 bg-white">
          <h2 className="text-lg font-medium text-charcoal-700 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., Classic Eucalyptus Wreath"
                className="mt-1"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (£) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="65.00"
                  className="mt-1"
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  {...register("stock", { valueAsNumber: true })}
                  placeholder="10"
                  className="mt-1"
                />
                {errors.stock && (
                  <p className="text-sm text-red-500 mt-1">{errors.stock.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe your wreath..."
                rows={4}
                className="mt-1"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Details */}
        <Card className="p-6 border-cream-300 bg-white">
          <h2 className="text-lg font-medium text-charcoal-700 mb-4">Product Details</h2>
          
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="size">Size *</Label>
                <Input
                  id="size"
                  {...register("size")}
                  placeholder="e.g., 40cm diameter"
                  className="mt-1"
                />
                {errors.size && (
                  <p className="text-sm text-red-500 mt-1">{errors.size.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sizeCategory">Size Category *</Label>
                <Select
                  value={watch("sizeCategory")}
                  onValueChange={(v) => setValue("sizeCategory", v as "small" | "large")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (£4.99 delivery)</SelectItem>
                    <SelectItem value="large">Large (£7.99 delivery)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="style">Style *</Label>
                <Select
                  value={watch("style")}
                  onValueChange={(v) => setValue("style", v as ProductFormData["style"])}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="rustic">Rustic</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="memorial">Memorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="categoryId">Category *</Label>
                <Select
                  value={watch("categoryId")}
                  onValueChange={(v) => setValue("categoryId", v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500 mt-1">{errors.categoryId.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="colours">Colours *</Label>
              <Input
                id="colours"
                {...register("colours")}
                placeholder="e.g., Green, White, Cream (comma-separated)"
                className="mt-1"
              />
              {errors.colours && (
                <p className="text-sm text-red-500 mt-1">{errors.colours.message}</p>
              )}
              <p className="text-sm text-charcoal-400 mt-1">
                Enter colours separated by commas
              </p>
            </div>

            <div>
              <Label htmlFor="suitableFor">Suitable For *</Label>
              <Input
                id="suitableFor"
                {...register("suitableFor")}
                placeholder="e.g., Front Door, Indoor, Gift (comma-separated)"
                className="mt-1"
              />
              {errors.suitableFor && (
                <p className="text-sm text-red-500 mt-1">{errors.suitableFor.message}</p>
              )}
              <p className="text-sm text-charcoal-400 mt-1">
                Enter occasions separated by commas
              </p>
            </div>
          </div>
        </Card>

        {/* Status */}
        <Card className="p-6 border-cream-300 bg-white">
          <h2 className="text-lg font-medium text-charcoal-700 mb-4">Status & Visibility</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={watch("status")}
                onValueChange={(v) => setValue("status", v as ProductFormData["status"])}
              >
                <SelectTrigger className="mt-1 w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="sold-out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-charcoal-400 mt-1">
                Draft products are not visible on the shop
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={watch("featured")}
                onCheckedChange={(checked) => setValue("featured", checked as boolean)}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured Product
              </Label>
            </div>
            <p className="text-sm text-charcoal-400 -mt-2 ml-6">
              Featured products appear on the homepage
            </p>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-sage-400 hover:bg-sage-500 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
