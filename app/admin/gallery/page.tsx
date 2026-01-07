"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  Upload,
  Sparkles,
  Image as ImageIcon,
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

// Placeholder gallery images
const galleryImages = [
  {
    id: "1",
    title: "Spring Blossom Wreath",
    category: "seasonal",
    featured: true,
    uploadedAt: "2024-11-10",
  },
  {
    id: "2",
    title: "Classic Eucalyptus",
    category: "classic",
    featured: true,
    uploadedAt: "2024-11-08",
  },
  {
    id: "3",
    title: "Memorial Rose Tribute",
    category: "memorial",
    featured: false,
    uploadedAt: "2024-11-05",
  },
  {
    id: "4",
    title: "Autumn Door Wreath",
    category: "seasonal",
    featured: true,
    uploadedAt: "2024-10-28",
  },
  {
    id: "5",
    title: "Modern Greenery",
    category: "modern",
    featured: false,
    uploadedAt: "2024-10-20",
  },
  {
    id: "6",
    title: "Lavender Mini Wreath",
    category: "classic",
    featured: false,
    uploadedAt: "2024-10-15",
  },
  {
    id: "7",
    title: "Christmas Berry Wreath",
    category: "seasonal",
    featured: true,
    uploadedAt: "2024-10-10",
  },
  {
    id: "8",
    title: "Peony & Rose Design",
    category: "classic",
    featured: false,
    uploadedAt: "2024-10-05",
  },
];

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

  const filteredImages = galleryImages.filter((image) => {
    const matchesSearch = image.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || image.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
      setSelectedImages(filteredImages.map((i) => i.id));
    }
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
              <div className="border-2 border-dashed border-cream-400 rounded-lg p-8 text-center">
                <ImageIcon className="h-12 w-12 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-600 mb-2">
                  Drag and drop images here
                </p>
                <p className="text-sm text-charcoal-400 mb-4">
                  or click to browse
                </p>
                <Button variant="outline">Select Files</Button>
              </div>
              <div>
                <Label>Category</Label>
                <Select defaultValue="classic">
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
              <div className="flex items-center space-x-2">
                <Checkbox id="featured" />
                <Label htmlFor="featured">Mark as featured</Label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="bg-sage-400 hover:bg-sage-500 text-white">
                  Upload
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
            <Button variant="outline" size="sm">
              Set Featured
            </Button>
            <Button variant="outline" size="sm">
              Change Category
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Select All */}
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <Card
            key={image.id}
            className={`relative overflow-hidden border-cream-300 bg-white group ${
              selectedImages.includes(image.id) ? "ring-2 ring-sage-400" : ""
            }`}
          >
            <div className="aspect-square bg-cream-200 relative">
              {/* Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-sage-300" />
              </div>

              {/* Checkbox */}
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedImages.includes(image.id)}
                  onCheckedChange={() => toggleSelect(image.id)}
                  className="bg-white"
                />
              </div>

              {/* Featured Badge */}
              {image.featured && (
                <Badge className="absolute top-2 right-2 bg-sage-400 text-white">
                  Featured
                </Badge>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8">
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {image.featured ? "Remove from Featured" : "Add to Featured"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
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
          {galleryImages.filter((i) => i.featured).length} featured
        </span>
      </div>
    </div>
  );
}
