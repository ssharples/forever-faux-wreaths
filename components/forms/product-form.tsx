"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { X, Plus, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(1, "Description is required"),
  size: z.string().min(1, "Size is required"),
  sizeCategory: z.enum(["small", "large"]),
  style: z.enum(["classic", "modern", "rustic", "seasonal", "memorial"]),
  stock: z.number().int().min(0),
  status: z.enum(["active", "draft", "sold-out"]),
  featured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: {
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
    colours: string[];
    suitableFor: string[];
    categoryId: string;
  };
  existingImageUrls?: string[];
  existingImageIds?: string[];
  onSubmit: (data: {
    formData: ProductFormData;
    imageIds: string[];
    colours: string[];
    suitableFor: string[];
    categoryId: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export function ProductForm({
  initialData,
  existingImageUrls = [],
  existingImageIds = [],
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const categories = useQuery(api.categories.list, {});
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const createCategory = useMutation(api.categories.create);

  const [imageIds, setImageIds] = useState<string[]>(existingImageIds);
  const [imageUrls, setImageUrls] = useState<string[]>(existingImageUrls);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [colours, setColours] = useState<string[]>(initialData?.colours ?? []);
  const [colourInput, setColourInput] = useState("");
  const [suitableFor, setSuitableFor] = useState<string[]>(initialData?.suitableFor ?? []);
  const [suitableForInput, setSuitableForInput] = useState("");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          price: initialData.price,
          description: initialData.description,
          size: initialData.size,
          sizeCategory: initialData.sizeCategory,
          style: initialData.style,
          stock: initialData.stock,
          status: initialData.status,
          featured: initialData.featured,
        }
      : {
          title: "",
          slug: "",
          price: 0,
          description: "",
          size: "",
          sizeCategory: "large" as const,
          style: "classic" as const,
          stock: 1,
          status: "draft" as const,
          featured: false,
        },
  });

  const autoSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title);
    if (!initialData) {
      setValue("slug", autoSlug(title));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsUploadingImages(true);
    try {
      for (const file of Array.from(files)) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        setImageIds((prev) => [...prev, storageId]);
        setImageUrls((prev) => [...prev, URL.createObjectURL(file)]);
      }
    } catch {
      toast.error("Failed to upload image");
    }
    setIsUploadingImages(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImageIds((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const addColour = () => {
    const trimmed = colourInput.trim();
    if (trimmed && !colours.includes(trimmed)) {
      setColours([...colours, trimmed]);
    }
    setColourInput("");
  };

  const addSuitableFor = () => {
    const trimmed = suitableForInput.trim();
    if (trimmed && !suitableFor.includes(trimmed)) {
      setSuitableFor([...suitableFor, trimmed]);
    }
    setSuitableForInput("");
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = await createCategory({ name: newCategoryName.trim(), slug });
    setCategoryId(id);
    setNewCategoryName("");
    setNewCategoryDialogOpen(false);
    toast.success("Category created");
  };

  const onFormSubmit = handleSubmit(async (formData: ProductFormData) => {
    if (imageIds.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    await onSubmit({ formData, imageIds, colours, suitableFor, categoryId });
  });

  return (
    <form onSubmit={onFormSubmit} className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <Card className="p-6 border-cream-300 bg-white">
            <h3 className="font-medium text-charcoal-700 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  {...register("title")}
                  onChange={handleTitleChange}
                  className="mt-1"
                  placeholder="e.g. Classic Eucalyptus Wreath"
                />
                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label>Slug</Label>
                <Input {...register("slug")} className="mt-1" placeholder="auto-generated-from-title" />
                {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (£) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    className="mt-1"
                  />
                  {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <Label>Stock *</Label>
                  <Input
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    className="mt-1"
                  />
                  <p className="text-xs text-charcoal-400 mt-1">
                    Use exact available quantity. For one-off wreaths, set this to `1`.
                  </p>
                  {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>}
                </div>
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea {...register("description")} rows={4} className="mt-1" placeholder="Describe your wreath..." />
                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
              </div>
            </div>
          </Card>

          <Card className="p-6 border-cream-300 bg-white">
            <h3 className="font-medium text-charcoal-700 mb-4">Images</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-cream-200">
                    <Image src={url} alt="" fill className="object-cover" sizes="150px" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-charcoal-900/60 rounded-full flex items-center justify-center text-white hover:bg-charcoal-900/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImages}
                  className="aspect-square rounded-lg border-2 border-dashed border-cream-400 flex flex-col items-center justify-center text-charcoal-400 hover:border-sage-400 hover:text-sage-600 transition-colors"
                >
                  {isUploadingImages ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 mb-1" />
                      <span className="text-xs">Upload</span>
                    </>
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="p-6 border-cream-300 bg-white">
            <h3 className="font-medium text-charcoal-700 mb-4">Details</h3>
            <div className="space-y-4">
              <div>
                <Label>Size</Label>
                <Input {...register("size")} className="mt-1" placeholder="e.g. 40cm diameter" />
              </div>
              <div>
                <Label>Size Category</Label>
                <Select value={watch("sizeCategory")} onValueChange={(v) => setValue("sizeCategory", v as "small" | "large")}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Style</Label>
                <Select
                  value={watch("style")}
                  onValueChange={(v: ProductFormData["style"]) => setValue("style", v)}
                >
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
                <Label>Category</Label>
                <div className="flex gap-2 mt-1">
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="icon" onClick={() => setNewCategoryDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Colours</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={colourInput}
                    onChange={(e) => setColourInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColour(); } }}
                    placeholder="Add colour..."
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={addColour}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colours.map((c) => (
                    <Badge key={c} variant="secondary" className="bg-cream-200 text-charcoal-600">
                      {c}
                      <button type="button" onClick={() => setColours(colours.filter((x) => x !== c))} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Suitable For</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={suitableForInput}
                    onChange={(e) => setSuitableForInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSuitableFor(); } }}
                    placeholder="Add tag..."
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={addSuitableFor}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {suitableFor.map((s) => (
                    <Badge key={s} variant="secondary" className="bg-cream-200 text-charcoal-600">
                      {s}
                      <button type="button" onClick={() => setSuitableFor(suitableFor.filter((x) => x !== s))} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-cream-300 bg-white">
            <h3 className="font-medium text-charcoal-700 mb-4">Publishing</h3>
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(v: ProductFormData["status"]) => setValue("status", v)}
                >
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sold-out">Sold Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal-700">Featured</p>
                  <p className="text-sm text-charcoal-500">Show on homepage</p>
                </div>
                <Switch checked={watch("featured")} onCheckedChange={(v) => setValue("featured", v)} />
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            disabled={isSubmitting || isUploadingImages}
            className="w-full bg-sage-400 hover:bg-sage-500 text-white"
            size="lg"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
            ) : initialData ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={newCategoryDialogOpen} onOpenChange={setNewCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="mt-1"
                placeholder="e.g. Wedding"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCategory} className="bg-sage-400 hover:bg-sage-500 text-white">
                Create
              </Button>
              <Button variant="outline" onClick={() => setNewCategoryDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
