"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  Upload,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  X,
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
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

export default function GalleryAdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<Id<"galleryImages"> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("classic");
  const [uploadFeatured, setUploadFeatured] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  // Convex queries and mutations
  const galleryImages = useQuery(api.galleryImages.list, {
    visible: undefined, // Show all for admin
  });
  const generateUploadUrl = useMutation(api.galleryImages.generateUploadUrl);
  const createImage = useMutation(api.galleryImages.create);
  const updateImage = useMutation(api.galleryImages.update);
  const deleteImage = useMutation(api.galleryImages.remove);

  const isLoading = galleryImages === undefined;

  const filteredImages = galleryImages?.filter((image) => {
    const matchesSearch = (image.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || image.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) ?? [];

  const toggleSelect = (id: string) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter((i) => i !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map((i) => i._id));
    }
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    setPendingFiles(Array.from(files));
  };

  const handleUpload = useCallback(async () => {
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    try {
      for (const file of pendingFiles) {
        if (!file.type.startsWith("image/")) continue;

        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) continue;

        const { storageId } = await result.json();
        
        // Get current max sortOrder
        const maxSort = galleryImages?.reduce((max, img) => Math.max(max, img.sortOrder), 0) ?? 0;

        await createImage({
          imageId: storageId,
          title: file.name.replace(/\.[^/.]+$/, ""),
          category: uploadCategory,
          sortOrder: maxSort + 1,
          visible: true,
        });

        successCount++;
      }

      toast.success(`${successCount} image(s) uploaded successfully`);
      setPendingFiles([]);
      setUploadDialogOpen(false);
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  }, [pendingFiles, generateUploadUrl, createImage, uploadCategory, galleryImages]);

  const handleDelete = async () => {
    if (!imageToDelete) return;
    try {
      await deleteImage({ id: imageToDelete });
      toast.success("Image deleted");
      setImageToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleToggleVisibility = async (id: Id<"galleryImages">, currentVisible: boolean) => {
    try {
      await updateImage({ id, visible: !currentVisible });
      toast.success(currentVisible ? "Image hidden" : "Image visible");
    } catch (error) {
      toast.error("Failed to update image");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedImages.map((id) => deleteImage({ id: id as Id<"galleryImages"> }))
      );
      toast.success(`${selectedImages.length} image(s) deleted`);
      setSelectedImages([]);
    } catch (error) {
      toast.error("Failed to delete images");
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl text-charcoal-700 mb-1">Gallery</h1>
          <p className="text-charcoal-500">Manage your portfolio images</p>
        </div>
        <Button
          onClick={() => setUploadDialogOpen(true)}
          className="bg-sage-400 hover:bg-sage-500 text-white"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6 border-cream-300 bg-white">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
            <Input
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Select All */}
      {!isLoading && filteredImages.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <Checkbox
            checked={
              selectedImages.length === filteredImages.length &&
              filteredImages.length > 0
            }
            onCheckedChange={toggleSelectAll}
          />
          <span className="text-sm text-charcoal-500">Select all</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-sage-400 mx-auto mb-4" />
          <p className="text-charcoal-500">Loading gallery...</p>
        </div>
      )}

      {/* Gallery Grid */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Card
              key={image._id}
              className={`relative overflow-hidden border-cream-300 bg-white group ${
                selectedImages.includes(image._id) ? "ring-2 ring-sage-400" : ""
              } ${!image.visible ? "opacity-60" : ""}`}
            >
              <div className="aspect-square bg-cream-200 relative">
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.title || "Gallery image"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-sage-300" />
                  </div>
                )}

                {/* Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedImages.includes(image._id)}
                    onCheckedChange={() => toggleSelect(image._id)}
                    className="bg-white"
                  />
                </div>

                {/* Hidden Badge */}
                {!image.visible && (
                  <Badge className="absolute top-2 right-2 bg-charcoal-500 text-white">
                    Hidden
                  </Badge>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-charcoal-700 text-sm truncate">
                      {image.title || "Untitled"}
                    </p>
                    <p className="text-xs text-charcoal-400 capitalize">
                      {image.category || "Uncategorized"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleToggleVisibility(image._id, image.visible)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {image.visible ? "Hide" : "Show"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setImageToDelete(image._id);
                          setDeleteDialogOpen(true);
                        }}
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
      )}

      {!isLoading && filteredImages.length === 0 && (
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
      {!isLoading && filteredImages.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-charcoal-500">
          <span>
            {filteredImages.length} of {galleryImages?.length ?? 0} images
          </span>
          <span>
            {galleryImages?.filter((i) => i.visible).length ?? 0} visible
          </span>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Images</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {pendingFiles.length === 0 ? (
              <label className="border-2 border-dashed border-cream-400 rounded-lg p-8 text-center cursor-pointer hover:border-sage-400 transition-colors block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                <ImageIcon className="h-12 w-12 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-600 mb-2">
                  Click to select images
                </p>
                <p className="text-sm text-charcoal-400">
                  or drag and drop
                </p>
              </label>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-charcoal-600">
                  {pendingFiles.length} file(s) selected:
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {pendingFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-cream-50 p-2 rounded">
                      <span className="truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setPendingFiles(pendingFiles.filter((_, j) => j !== i))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>Category</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger className="mt-1">
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

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleUpload}
                disabled={isUploading || pendingFiles.length === 0}
                className="bg-sage-400 hover:bg-sage-500 text-white"
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
                onClick={() => {
                  setUploadDialogOpen(false);
                  setPendingFiles([]);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
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
