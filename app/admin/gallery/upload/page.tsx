"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const categories = [
  { value: "classic", label: "Classic" },
  { value: "seasonal", label: "Seasonal" },
  { value: "memorial", label: "Memorial" },
  { value: "modern", label: "Modern" },
  { value: "rustic", label: "Rustic" },
  { value: "special", label: "Special" },
];

interface FilePreview {
  file: File;
  preview: string;
}

export default function GalleryUploadPage() {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [category, setCategory] = useState("classic");
  const [visible, setVisible] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<FilePreview[]>([]);

  const allImages = useQuery(api.galleryImages.adminList, {});
  const generateUploadUrl = useMutation(api.galleryImages.generateUploadUrl);
  const createGalleryImage = useMutation(api.galleryImages.create);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => URL.revokeObjectURL(file.preview));
      filesRef.current = [];
    };
  }, []);

  const clearSelectedFiles = () => {
    filesRef.current.forEach((file) => URL.revokeObjectURL(file.preview));
    filesRef.current = [];
    setFiles([]);
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    const previews: FilePreview[] = Array.from(selected).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...previews]);
    // reset input so same file can be re-added if needed
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    const previews = dropped.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...previews]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setUploadedCount(0);

    const maxSort =
      (allImages ?? []).reduce(
        (max, img) => Math.max(max, img.sortOrder),
        0
      );

    let uploaded = 0;
    try {
      for (const { file } of files) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        await createGalleryImage({
          imageId: storageId,
          title: file.name.replace(/\.[^.]+$/, ""),
          category,
          sortOrder: maxSort + uploaded + 1,
          visible,
        });
        uploaded++;
        setUploadedCount(uploaded);
      }
      toast.success(`${uploaded} image${uploaded !== 1 ? "s" : ""} uploaded successfully`);
      clearSelectedFiles();
    } catch {
      toast.error("Upload failed — please try again");
    }
    setIsUploading(false);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal-500 hover:text-charcoal-700 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>
        <h1 className="text-3xl text-charcoal-700 mb-1">Upload Images</h1>
        <p className="text-charcoal-500">
          Add new images to your gallery portfolio
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Drop Zone */}
        <div className="lg:col-span-2 space-y-4">
          {/* Drop area */}
          <button
            type="button"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Select or drop gallery images"
            className="w-full border-2 border-dashed border-cream-400 hover:border-sage-400 rounded-xl p-10 text-center cursor-pointer transition-colors group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFilesSelected}
            />
            <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-sage-200 transition-colors">
              <Upload className="h-6 w-6 text-sage-600" />
            </div>
            <p className="text-charcoal-700 font-medium mb-1">
              Drop images here or click to browse
            </p>
            <p className="text-sm text-charcoal-400">
              PNG, JPG, WebP — multiple files supported
            </p>
          </button>

          {/* File previews */}
          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {files.map((f, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-cream-200">
                  <Image
                    src={f.preview}
                    alt={f.file.name}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/40 transition-colors" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    aria-label={`Remove ${f.file.name}`}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <X className="h-4 w-4 text-charcoal-600" />
                  </button>
                  <p className="absolute bottom-0 inset-x-0 px-2 py-1.5 bg-charcoal-900/60 text-white text-xs truncate">
                    {f.file.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings + Upload */}
        <div className="space-y-4">
          <Card className="p-5 border-cream-300 bg-white">
            <h2 className="text-base font-medium text-charcoal-700 mb-4 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-sage-600" />
              Upload Settings
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="gallery-upload-page-category" className="mb-1 block">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="gallery-upload-page-category">
                    <SelectValue />
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

              <div className="flex items-center gap-2">
                <Checkbox
                  id="gallery-upload-page-visible"
                  checked={visible}
                  onCheckedChange={(val) => setVisible(val === true)}
                />
                <Label htmlFor="gallery-upload-page-visible" className="cursor-pointer">
                  Visible in gallery
                </Label>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-cream-300 bg-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal-500">Files selected</span>
                <span className="font-medium text-charcoal-700">
                  {files.length}
                </span>
              </div>
              {isUploading && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal-500">Uploaded</span>
                  <span className="font-medium text-sage-600">
                    {uploadedCount} / {files.length}
                  </span>
                </div>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading}
              className="w-full mt-4 bg-sage-400 hover:bg-sage-500 text-white"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading {uploadedCount}/{files.length}...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {files.length > 0 ? `${files.length} ` : ""}
                  Image{files.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>

            {!isUploading && files.length === 0 && (
              <p className="text-xs text-charcoal-400 text-center mt-2">
                Select images to enable upload
              </p>
            )}
          </Card>

          {uploadedCount > 0 && !isUploading && (
            <div className="flex items-center gap-2 p-3 bg-sage-50 rounded-lg text-sm text-sage-700">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>
                {uploadedCount} image{uploadedCount !== 1 ? "s" : ""} uploaded
              </span>
              <Link
                href="/admin/gallery"
                className="ml-auto font-medium hover:underline"
              >
                View Gallery
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
