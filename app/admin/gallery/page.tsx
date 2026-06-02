"use client";

import { useState, useRef } from "react";
import {
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  Upload,
  Image as ImageIcon,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { toast } from "sonner";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "classic", label: "Classic" },
  { value: "seasonal", label: "Seasonal" },
  { value: "memorial", label: "Memorial" },
  { value: "modern", label: "Modern" },
  { value: "rustic", label: "Rustic" },
  { value: "special", label: "Special" },
];

type GalleryImageWithUrl = Doc<"galleryImages"> & {
  url: string | null;
};

export default function GalleryAdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedImages, setSelectedImages] = useState<Id<"galleryImages">[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("classic");
  const [uploadVisible, setUploadVisible] = useState(true);
  const [bulkCategory, setBulkCategory] = useState("none");
  const [viewingImage, setViewingImage] = useState<GalleryImageWithUrl | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImageWithUrl | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("classic");
  const [editVisible, setEditVisible] = useState(true);

  const allImages = useQuery(api.galleryImages.adminList, {});
  const generateUploadUrl = useMutation(api.galleryImages.generateUploadUrl);
  const createGalleryImage = useMutation(api.galleryImages.create);
  const removeGalleryImage = useMutation(api.galleryImages.remove);
  const updateGalleryImage = useMutation(api.galleryImages.update);
  const bulkUpdateGalleryImages = useMutation(api.galleryImages.bulkUpdate);
  const bulkRemoveGalleryImages = useMutation(api.galleryImages.bulkRemove);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const galleryImages = allImages ?? [];

  const filteredImages = galleryImages.filter((image) => {
    const matchesSearch = (image.title ?? "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || image.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleSelect = (id: Id<"galleryImages">) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter((i) => i !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const openEditDialog = (image: GalleryImageWithUrl) => {
    setEditingImage(image);
    setEditTitle(image.title ?? "");
    setEditCategory(image.category ?? "classic");
    setEditVisible(image.visible);
  };

  const runBulkVisibleUpdate = async (visible: boolean) => {
    setIsBulkUpdating(true);
    try {
      await bulkUpdateGalleryImages({ ids: selectedImages, visible });
      setSelectedImages([]);
      toast.success(visible ? "Images set visible" : "Images hidden");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update selected images"
      );
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const runBulkCategoryUpdate = async () => {
    if (bulkCategory === "none") {
      toast.error("Choose a category first");
      return;
    }

    setIsBulkUpdating(true);
    try {
      await bulkUpdateGalleryImages({ ids: selectedImages, category: bulkCategory });
      setBulkCategory("none");
      setSelectedImages([]);
      toast.success("Image categories updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update image categories"
      );
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const runBulkDelete = async () => {
    setIsBulkUpdating(true);
    try {
      await bulkRemoveGalleryImages({ ids: selectedImages });
      setSelectedImages([]);
      toast.success("Images deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete selected images"
      );
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const saveImageDetails = async () => {
    if (!editingImage) return;
    try {
      await updateGalleryImage({
        id: editingImage._id,
        title: editTitle.trim() || undefined,
        category: editCategory,
        visible: editVisible,
      });
      setEditingImage(null);
      toast.success("Image details updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update image");
    }
  };

  const toggleImageVisibility = async (image: GalleryImageWithUrl) => {
    try {
      await updateGalleryImage({ id: image._id, visible: !image.visible });
      toast.success(image.visible ? "Image hidden" : "Image visible");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update image");
    }
  };

  const deleteImage = async (image: GalleryImageWithUrl) => {
    try {
      await removeGalleryImage({ id: image._id });
      setSelectedImages((current) => current.filter((id) => id !== image._id));
      toast.success("Image deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete image");
    }
  };

  const toggleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map((i) => i._id));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        const maxSort = galleryImages.reduce((max, img) => Math.max(max, img.sortOrder), 0);
        await createGalleryImage({
          imageId: storageId,
          title: file.name.replace(/\.[^.]+$/, ""),
          category: uploadCategory,
          sortOrder: maxSort + 1,
          visible: uploadVisible,
        });
      }
      toast.success(`${files.length} image(s) uploaded`);
      setUploadDialogOpen(false);
    } catch {
      toast.error("Upload failed");
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl text-charcoal-700 mb-1">Gallery</h1>
          <p className="text-charcoal-500">
            Manage your portfolio images
          </p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sage-400 hover:bg-sage-500 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Images</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="border-2 border-dashed border-cream-400 rounded-lg p-8 text-center">
                <ImageIcon className="h-12 w-12 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-600 mb-2">
                  Drag and drop images here
                </p>
                <p className="text-sm text-charcoal-400 mb-4">
                  or click to browse
                </p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Select Files
                </Button>
              </div>
              <div>
                <Label htmlFor="gallery-upload-category">Category</Label>
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger id="gallery-upload-category" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c.value !== "all")
                      .map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gallery-upload-visible"
                  checked={uploadVisible}
                  onCheckedChange={(checked) => setUploadVisible(checked === true)}
                />
                <Label htmlFor="gallery-upload-visible">Visible in gallery</Label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  className="bg-sage-400 hover:bg-sage-500 text-white"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6 border-cream-300 bg-white">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
            <Input
              aria-label="Search gallery images"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedImages.length > 0 && (
        <div className="mb-4 p-3 bg-sage-50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-sage-700">
            {selectedImages.length} image(s) selected
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isBulkUpdating}
              onClick={() => void runBulkVisibleUpdate(true)}
            >
              Set Visible
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isBulkUpdating}
              onClick={() => void runBulkVisibleUpdate(false)}
            >
              Hide
            </Button>
            <Select value={bulkCategory} onValueChange={setBulkCategory}>
              <SelectTrigger className="w-[190px] bg-white">
                <SelectValue placeholder="Change category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Change category...</SelectItem>
                {categories
                  .filter((cat) => cat.value !== "all")
                  .map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
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

      {/* Select All */}
      <div className="mb-4 flex items-center gap-2">
        <Checkbox
          id="gallery-select-all"
          checked={
            selectedImages.length === filteredImages.length &&
            filteredImages.length > 0
          }
          onCheckedChange={toggleSelectAll}
        />
        <Label htmlFor="gallery-select-all" className="text-sm text-charcoal-500">
          Select all
        </Label>
      </div>

      {/* Gallery Grid */}
      {allImages === undefined ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sage-400" />
        </div>
      ) : (
      <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <Card
            key={image._id}
            className={`relative overflow-hidden border-cream-300 bg-white group ${
              selectedImages.includes(image._id) ? "ring-2 ring-sage-400" : ""
            }`}
          >
            <div className="aspect-square bg-cream-200 relative">
              {/* Image */}
              {image.url && (
                <Image src={image.url} alt={image.title || ""} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              )}

              {/* Checkbox */}
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  aria-label={`Select ${image.title || "gallery image"}`}
                  checked={selectedImages.includes(image._id)}
                  onCheckedChange={() => toggleSelect(image._id)}
                  className="bg-white"
                />
              </div>

              {/* Visible Badge */}
              {image.visible && (
                <Badge className="absolute top-2 right-2 bg-sage-400 text-white">
                  Visible
                </Badge>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-11 w-11"
                    onClick={() => setViewingImage(image)}
                  >
                    <span className="sr-only">View image</span>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-11 w-11"
                    onClick={() => openEditDialog(image)}
                  >
                    <span className="sr-only">Edit image details</span>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-charcoal-700 text-sm truncate">
                    {image.title}
                  </p>
                  <p className="text-xs text-charcoal-400 capitalize">
                    {image.category}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      aria-label={`Open actions for ${image.title || "gallery image"}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setViewingImage(image)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditDialog(image)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => void toggleImageVisibility(image)}>
                      {image.visible ? "Hide from Gallery" : "Show in Gallery"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => void deleteImage(image)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <Card className="p-12 border-cream-300 bg-white text-center">
          <ImageIcon className="h-12 w-12 text-sage-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-charcoal-700 mb-2">
            No images found
          </h3>
          <p className="text-charcoal-500 mb-4">
            {searchQuery || categoryFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Upload your first gallery image"}
          </p>
          {!searchQuery && categoryFilter === "all" && (
            <Button
              className="bg-sage-400 hover:bg-sage-500 text-white"
              onClick={() => setUploadDialogOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
          )}
        </Card>
      )}

      {/* Stats */}
      <div className="mt-6 flex items-center justify-between text-sm text-charcoal-500">
        <span>
          {filteredImages.length} of {galleryImages.length} images
        </span>
        <span>
          {galleryImages.filter((i) => i.visible).length} visible
        </span>
      </div>
      </>
      )}

      <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
        {viewingImage && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{viewingImage.title || "Gallery image"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-cream-100">
                {viewingImage.url && (
                  <Image
                    src={viewingImage.url}
                    alt={viewingImage.title || "Gallery image"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-cream-200 text-charcoal-600 capitalize">
                  {viewingImage.category || "Uncategorised"}
                </Badge>
                <Badge
                  className={
                    viewingImage.visible
                      ? "bg-sage-100 text-sage-700"
                      : "bg-charcoal-100 text-charcoal-600"
                  }
                >
                  {viewingImage.visible ? "Visible" : "Hidden"}
                </Badge>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
        {editingImage && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Image Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="gallery-edit-title">Title</Label>
                <Input
                  id="gallery-edit-title"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="gallery-edit-category">Category</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger id="gallery-edit-category" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat.value !== "all")
                      .map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="gallery-edit-visible"
                  checked={editVisible}
                  onCheckedChange={(checked) => setEditVisible(checked === true)}
                />
                <Label htmlFor="gallery-edit-visible">Visible in gallery</Label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditingImage(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-sage-400 hover:bg-sage-500 text-white"
                  onClick={() => void saveImageDetails()}
                >
                  Save Details
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
