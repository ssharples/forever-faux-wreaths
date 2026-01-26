"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Upload,
  X,
  Sparkles,
  Info,
  Check,
  Loader2,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const arrangementTypes = [
  { value: "door-wreath", label: "Door Wreath" },
  { value: "wall-wreath", label: "Wall Wreath" },
  { value: "memorial", label: "Memorial Tribute" },
  { value: "table-centrepiece", label: "Table Centrepiece" },
  { value: "other", label: "Other" },
];

const colourThemes = [
  { value: "sage-green", label: "Sage & Neutrals", color: "bg-sage-200" },
  { value: "blush-pink", label: "Blush & Cream", color: "bg-blush-400/30" },
  { value: "autumn", label: "Autumn Tones", color: "bg-terracotta-400/30" },
  { value: "winter", label: "Winter", color: "bg-charcoal-200" },
  { value: "spring", label: "Spring Pastels", color: "bg-sage-100" },
  { value: "summer", label: "Summer Brights", color: "bg-gold-400/30" },
  { value: "custom", label: "Custom", color: "bg-cream-300" },
];

const wreathBases = [
  { value: "wicker", label: "Natural Wicker" },
  { value: "moss", label: "Moss Covered" },
  { value: "vine", label: "Grapevine" },
  { value: "foam", label: "Floral Foam (for dense designs)" },
];

const sizes = [
  { value: "20cm", label: "Small", size: "20cm", price: 45, desc: "Perfect for interior doors" },
  { value: "30cm", label: "Medium", size: "30cm", price: 55, desc: "Most popular choice" },
  { value: "40cm", label: "Large", size: "40cm", price: 70, desc: "Statement piece" },
  { value: "50cm", label: "Extra Large", size: "50cm", price: 85, desc: "Grand entrance" },
  { value: "custom", label: "Custom", size: "?", price: null, desc: "Unique dimensions" },
];

const occasions = [
  { value: "home-decor", label: "Home Decor" },
  { value: "wedding", label: "Wedding" },
  { value: "memorial", label: "Memorial / Remembrance" },
  { value: "birthday", label: "Birthday Gift" },
  { value: "mothers-day", label: "Mother's Day" },
  { value: "christmas", label: "Christmas" },
  { value: "easter", label: "Easter / Spring" },
  { value: "other", label: "Other" },
];

const RIBBON_PRICE = 5;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const expandVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    marginTop: 0,
  },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 16,
    transition: {
      height: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      height: { duration: 0.2 },
      opacity: { duration: 0.1 },
    },
  },
};

// Animated counter for price
function AnimatedPrice({ value }: { value: number | null }) {
  const [displayValue, setDisplayValue] = useState(value || 0);

  useEffect(() => {
    if (value === null) return;

    const duration = 400;
    const startValue = displayValue;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + (value - startValue) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (value === null) {
    return (
      <p className="text-charcoal-500">Select options to see estimate</p>
    );
  }

  return (
    <motion.p
      className="font-display text-4xl text-charcoal-700"
      key={value}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      from £{displayValue}
    </motion.p>
  );
}

// Form progress indicator
function FormProgress({ formData }: { formData: Record<string, unknown> }) {
  const requiredFields = [
    "name",
    "email",
    "arrangementType",
    "colourTheme",
    "wreathBase",
    "size",
  ];
  const filledFields = requiredFields.filter(
    (field) => formData[field] && String(formData[field]).length > 0
  );
  const progress = (filledFields.length / requiredFields.length) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-charcoal-500">
        <span>Form Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-sage-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Enhanced upload zone with drag state
function UploadZone({
  onFileChange,
  images,
  onRemove,
}: {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  images: File[];
  onRemove: (index: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-4">
      <motion.label
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-sage-400 bg-sage-50 scale-[1.02]"
            : "border-cream-400 hover:bg-cream-200 hover:border-sage-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <motion.div
          className="flex flex-col items-center"
          animate={{ y: isDragging ? -4 : 0 }}
        >
          <Upload
            className={`h-8 w-8 mb-2 transition-colors ${isDragging ? "text-sage-500" : "text-charcoal-400"}`}
          />
          <p className="text-sm text-charcoal-500">
            {isDragging ? "Drop images here" : "Click or drag to upload images"}
          </p>
          <p className="text-xs text-charcoal-400 mt-1">Max 5 images</p>
        </motion.div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onFileChange}
          className="hidden"
        />
      </motion.label>

      <AnimatePresence mode="popLayout">
        {images.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {images.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream-200 border-2 border-cream-300 group-hover:border-sage-300 transition-colors">
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-sage-400" />
                  </div>
                </div>
                <motion.button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute -top-2 -right-2 h-6 w-6 bg-charcoal-600 rounded-full flex items-center justify-center text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-3 w-3" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animated form field wrapper
function FormField({
  children,
  label,
  required,
  hint,
}: {
  children: React.ReactNode;
  label: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="group">
      <Label className="text-charcoal-600 group-focus-within:text-sage-600 transition-colors">
        {label} {required && <span className="text-sage-500">*</span>}
      </Label>
      {children}
      {hint && (
        <p className="text-xs text-charcoal-400 mt-1.5 opacity-0 group-focus-within:opacity-100 transition-opacity">
          {hint}
        </p>
      )}
    </div>
  );
}

// Mobile-friendly colour theme selector
function ColourThemeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
      {colourThemes.map((theme) => {
        const isSelected = value === theme.value;
        return (
          <motion.button
            key={theme.value}
            type="button"
            onClick={() => onChange(theme.value)}
            className={`relative flex flex-col items-center p-2 sm:p-3 rounded-xl border-2 transition-all ${
              isSelected
                ? "border-sage-400 bg-sage-50 shadow-sm"
                : "border-cream-200 hover:border-sage-200 hover:bg-cream-50"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${theme.color} flex items-center justify-center mb-1 border border-cream-300`}
            >
              {theme.value === "custom" && (
                <Sparkles className={`h-4 w-4 ${isSelected ? "text-sage-600" : "text-charcoal-400"}`} />
              )}
            </div>
            <span className={`text-[10px] sm:text-xs text-center leading-tight ${isSelected ? "text-sage-700 font-medium" : "text-charcoal-500"}`}>
              {theme.label}
            </span>
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-sage-400 rounded-full flex items-center justify-center"
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

// Mobile-friendly size selector
function SizeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
      {sizes.map((size) => {
        const isSelected = value === size.value;
        return (
          <motion.button
            key={size.value}
            type="button"
            onClick={() => onChange(size.value)}
            className={`relative flex flex-col items-center p-3 sm:p-4 rounded-xl border-2 transition-all ${
              isSelected
                ? "border-sage-400 bg-sage-50 shadow-sm"
                : "border-cream-200 hover:border-sage-200 hover:bg-cream-50"
            }`}
            whileTap={{ scale: 0.97 }}
          >
            {/* Size circle indicator */}
            <div className="relative mb-2">
              <Circle
                className={`h-8 w-8 sm:h-10 sm:w-10 ${isSelected ? "text-sage-400" : "text-cream-300"}`}
                strokeWidth={2}
              />
              <span className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${isSelected ? "text-sage-600" : "text-charcoal-400"}`}>
                {size.size}
              </span>
            </div>
            <span className={`text-sm font-medium ${isSelected ? "text-sage-700" : "text-charcoal-600"}`}>
              {size.label}
            </span>
            {size.price ? (
              <span className={`text-xs ${isSelected ? "text-sage-600" : "text-charcoal-400"}`}>
                from £{size.price}
              </span>
            ) : (
              <span className="text-xs text-charcoal-400">Quote</span>
            )}
            <span className="text-[10px] text-charcoal-400 mt-1 hidden sm:block">
              {size.desc}
            </span>
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-sage-400 rounded-full flex items-center justify-center shadow-sm"
                >
                  <Check className="h-3.5 w-3.5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

// Mobile sticky footer with price and progress
function MobileStickyFooter({
  estimatedPrice,
  progress,
  isSubmitting,
  canSubmit,
  onSubmit,
}: {
  estimatedPrice: number | null;
  progress: number;
  isSubmitting: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-cream-300 shadow-lg"
    >
      {/* Progress bar */}
      <div className="h-1 bg-cream-200">
        <motion.div
          className="h-full bg-sage-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Price */}
        <div className="flex-1 min-w-0">
          {estimatedPrice !== null ? (
            <div>
              <p className="text-xs text-charcoal-400">Estimated from</p>
              <p className="text-xl font-display text-charcoal-700">£{estimatedPrice}</p>
            </div>
          ) : (
            <p className="text-sm text-charcoal-400">Select options for estimate</p>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting || !canSubmit}
          className="bg-sage-400 hover:bg-sage-500 text-white px-6"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Submit
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

export default function BespokePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    arrangementType: "",
    colourTheme: "",
    customColour: "",
    ribbon: false,
    ribbonColour: "",
    wreathBase: "",
    size: "",
    customSize: "",
    occasion: "",
    notes: "",
    consent: false,
  });

  const [inspirationImages, setInspirationImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculate estimated price
  const estimatedPrice = useMemo(() => {
    const selectedSize = sizes.find((s) => s.value === formData.size);
    if (!selectedSize || selectedSize.price === null) return null;

    let total = selectedSize.price;
    if (formData.ribbon) {
      total += RIBBON_PRICE;
    }
    return total;
  }, [formData.size, formData.ribbon]);

  // Calculate form progress for mobile footer
  const formProgress = useMemo(() => {
    const requiredFields = [
      "name",
      "email",
      "arrangementType",
      "colourTheme",
      "wreathBase",
      "size",
    ];
    const filledFields = requiredFields.filter(
      (field) => formData[field as keyof typeof formData] && String(formData[field as keyof typeof formData]).length > 0
    );
    return (filledFields.length / requiredFields.length) * 100;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      toast.error("Please agree to the privacy policy to continue");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast.success("Enquiry submitted successfully!", {
      description: "We'll be in touch within 24-48 hours.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + inspirationImages.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setInspirationImages([...inspirationImages, ...files].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setInspirationImages(inspirationImages.filter((_, i) => i !== index));
  };

  // Success state
  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-cream-100 flex items-center justify-center min-h-[60vh]">
          <motion.div
            className="text-center max-w-md px-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-sage-100 mx-auto mb-6 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Check className="h-10 w-10 text-sage-500" />
            </motion.div>
            <motion.h2
              className="text-2xl mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Thank You!
            </motion.h2>
            <motion.p
              className="text-charcoal-500 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Your bespoke enquiry has been received. I&apos;ll review your
              request and get back to you within 24-48 hours with a quote.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button asChild className="bg-sage-400 hover:bg-sage-500 text-white">
                <Link href="/shop">
                  Browse Ready-Made Wreaths
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="flex-1 bg-cream-100">
        {/* Hero */}
        <section className="bg-gradient-to-b from-sage-100 to-cream-100 py-10 sm:py-16 overflow-hidden">
          <motion.div
            className="container-narrow text-center px-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          >
            <motion.p
              className="font-handwritten text-xl sm:text-2xl text-sage-600 mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Something special in mind?
            </motion.p>
            <motion.h1
              className="mb-4 sm:mb-6 text-2xl sm:text-4xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Bespoke Order Enquiry
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg text-charcoal-500 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Tell me about your vision and I&apos;ll create something beautiful
              just for you.
            </motion.p>
          </motion.div>
        </section>

        {/* Form Section */}
        <section className="py-8 sm:py-12 pb-28 lg:pb-12">
          <div className="container-narrow">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Contact Information */}
                  <motion.div variants={cardVariants}>
                    <Card className="p-4 sm:p-6 border-cream-300 hover:border-sage-200 transition-colors">
                      <h3 className="text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-xs sm:text-sm font-medium">
                          1
                        </span>
                        Contact Information
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        <FormField label="Name" required>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                            className="mt-1.5 focus:border-sage-400 focus:ring-sage-400/20"
                            placeholder="Your full name"
                          />
                        </FormField>
                        <FormField label="Email" required>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            required
                            className="mt-1.5 focus:border-sage-400 focus:ring-sage-400/20"
                            placeholder="your@email.com"
                          />
                        </FormField>
                        <div className="sm:col-span-2">
                          <FormField
                            label="Phone"
                            hint="Optional - helpful for quick questions"
                          >
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                              }
                              className="mt-1.5 focus:border-sage-400 focus:ring-sage-400/20"
                              placeholder="07xxx xxxxxx"
                            />
                          </FormField>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Design Details */}
                  <motion.div variants={cardVariants}>
                    <Card className="p-4 sm:p-6 border-cream-300 hover:border-sage-200 transition-colors">
                      <h3 className="text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-xs sm:text-sm font-medium">
                          2
                        </span>
                        Design Details
                      </h3>
                      <div className="space-y-4 sm:space-y-5">
                        <FormField label="Type of Arrangement" required>
                          <Select
                            value={formData.arrangementType}
                            onValueChange={(value) =>
                              setFormData({ ...formData, arrangementType: value })
                            }
                          >
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {arrangementTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>

                        <div className="space-y-2">
                          <Label className="text-charcoal-600">
                            Colour Theme <span className="text-sage-500">*</span>
                          </Label>
                          <ColourThemeSelector
                            value={formData.colourTheme}
                            onChange={(value) =>
                              setFormData({ ...formData, colourTheme: value })
                            }
                          />
                        </div>

                        <AnimatePresence>
                          {formData.colourTheme === "custom" && (
                            <motion.div
                              variants={expandVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <FormField
                                label="Describe your colour preferences"
                                hint="Be as specific as you like"
                              >
                                <Input
                                  id="customColour"
                                  value={formData.customColour}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      customColour: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., Navy blue, gold accents, white flowers"
                                  className="mt-1.5"
                                />
                              </FormField>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <label
                          htmlFor="ribbon"
                          className="flex items-start space-x-3 py-4 px-4 -mx-4 rounded-lg hover:bg-sage-50/50 transition-colors cursor-pointer"
                        >
                          <Checkbox
                            id="ribbon"
                            checked={formData.ribbon}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                ribbon: checked as boolean,
                              })
                            }
                            className="mt-0.5"
                          />
                          <div className="space-y-1 flex-1">
                            <span className="font-medium text-sm text-charcoal-700">
                              Add a ribbon (+£{RIBBON_PRICE})
                            </span>
                            <p className="text-sm text-charcoal-400">
                              A decorative bow or hanging ribbon
                            </p>
                          </div>
                          {formData.ribbon && (
                            <div className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center">
                              <Check className="h-3.5 w-3.5 text-sage-600" />
                            </div>
                          )}
                        </label>

                        <AnimatePresence>
                          {formData.ribbon && (
                            <motion.div
                              variants={expandVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <FormField label="Ribbon Colour">
                                <Input
                                  id="ribbonColour"
                                  value={formData.ribbonColour}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      ribbonColour: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., Natural jute, sage green satin"
                                  className="mt-1.5"
                                />
                              </FormField>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <FormField label="Wreath Base" required>
                          <Select
                            value={formData.wreathBase}
                            onValueChange={(value) =>
                              setFormData({ ...formData, wreathBase: value })
                            }
                          >
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder="Select base type" />
                            </SelectTrigger>
                            <SelectContent>
                              {wreathBases.map((base) => (
                                <SelectItem key={base.value} value={base.value}>
                                  {base.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>

                        <div className="space-y-2">
                          <Label className="text-charcoal-600">
                            Size <span className="text-sage-500">*</span>
                          </Label>
                          <SizeSelector
                            value={formData.size}
                            onChange={(value) =>
                              setFormData({ ...formData, size: value })
                            }
                          />
                        </div>

                        <AnimatePresence>
                          {formData.size === "custom" && (
                            <motion.div
                              variants={expandVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <FormField label="Describe your size requirements">
                                <Input
                                  id="customSize"
                                  value={formData.customSize}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      customSize: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., 60cm diameter, heart shape 30x40cm"
                                  className="mt-1.5"
                                />
                              </FormField>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <FormField label="Occasion">
                          <Select
                            value={formData.occasion}
                            onValueChange={(value) =>
                              setFormData({ ...formData, occasion: value })
                            }
                          >
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder="Select occasion (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              {occasions.map((occ) => (
                                <SelectItem key={occ.value} value={occ.value}>
                                  {occ.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Inspiration Images */}
                  <motion.div variants={cardVariants}>
                    <Card className="p-4 sm:p-6 border-cream-300 hover:border-sage-200 transition-colors">
                      <h3 className="text-lg sm:text-xl mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-xs sm:text-sm font-medium">
                          3
                        </span>
                        Inspiration Images
                      </h3>
                      <p className="text-sm text-charcoal-400 mb-4">
                        Upload up to 5 images to help me understand your vision
                        (optional)
                      </p>

                      <UploadZone
                        onFileChange={handleFileChange}
                        images={inspirationImages}
                        onRemove={removeImage}
                      />
                    </Card>
                  </motion.div>

                  {/* Additional Notes */}
                  <motion.div variants={cardVariants}>
                    <Card className="p-4 sm:p-6 border-cream-300 hover:border-sage-200 transition-colors">
                      <h3 className="text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-xs sm:text-sm font-medium">
                          4
                        </span>
                        Additional Notes
                      </h3>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="Any other details you'd like to share - specific flowers, special requirements, date needed by, etc."
                        rows={4}
                        className="focus:border-sage-400 focus:ring-sage-400/20"
                      />
                    </Card>
                  </motion.div>

                  {/* Consent & Submit */}
                  <motion.div variants={cardVariants}>
                    <Card className="p-4 sm:p-6 border-cream-300">
                      <div className="flex items-start space-x-3 mb-6 p-3 -m-3 rounded-lg hover:bg-cream-50 transition-colors">
                        <Checkbox
                          id="consent"
                          checked={formData.consent}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              consent: checked as boolean,
                            })
                          }
                          className="mt-0.5"
                        />
                        <label htmlFor="consent" className="text-sm cursor-pointer text-charcoal-600">
                          I agree to the{" "}
                          <Link
                            href="/legal/privacy"
                            className="text-sage-600 hover:underline"
                          >
                            Privacy Policy
                          </Link>{" "}
                          and consent to Forever Faux Wreaths storing my information
                          to respond to this enquiry.
                        </label>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-sage-400 hover:bg-sage-500 text-white relative overflow-hidden hidden lg:flex"
                        disabled={isSubmitting || !formData.consent}
                      >
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.span
                              key="submitting"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center"
                            >
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </motion.span>
                          ) : (
                            <motion.span
                              key="submit"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center"
                            >
                              Submit Enquiry
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </Card>
                  </motion.div>
                </motion.form>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  className="sticky top-24 space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {/* Progress */}
                  <Card className="p-5 border-cream-300">
                    <FormProgress formData={formData} />
                  </Card>

                  {/* Price Estimate */}
                  <Card className="p-6 border-sage-300 bg-sage-50">
                    <h4 className="font-medium text-charcoal-600 mb-4 flex items-center gap-2">
                      Estimated Price
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-charcoal-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">
                              This is an estimate. Final price may vary based on
                              complexity and materials.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h4>
                    <AnimatedPrice value={estimatedPrice} />
                    <p className="text-sm text-charcoal-400 mt-2">
                      *Custom designs may vary
                    </p>
                  </Card>

                  {/* Base Pricing */}
                  <Card className="p-6 border-cream-300">
                    <h4 className="font-medium text-charcoal-600 mb-4">
                      Base Pricing
                    </h4>
                    <ul className="space-y-2 text-sm text-charcoal-500">
                      {sizes
                        .filter((s) => s.price !== null)
                        .map((size) => (
                          <motion.li
                            key={size.value}
                            className={`flex justify-between py-1.5 px-2 -mx-2 rounded transition-colors ${
                              formData.size === size.value
                                ? "bg-sage-50 text-sage-700"
                                : ""
                            }`}
                            animate={{
                              backgroundColor:
                                formData.size === size.value
                                  ? "rgb(243, 247, 243)"
                                  : "transparent",
                            }}
                          >
                            <span>{size.label.split(" - ")[0]}</span>
                            <span className="font-medium">from £{size.price}</span>
                          </motion.li>
                        ))}
                      <li className="flex justify-between pt-2 border-t border-cream-300">
                        <span>Ribbon add-on</span>
                        <span className="font-medium">+£{RIBBON_PRICE}</span>
                      </li>
                    </ul>
                  </Card>

                  {/* Process */}
                  <Card className="p-6 border-cream-300">
                    <h4 className="font-medium text-charcoal-600 mb-4">
                      How It Works
                    </h4>
                    <ol className="space-y-3 text-sm text-charcoal-500">
                      {[
                        "Submit your enquiry with your vision",
                        "I'll review and send you a quote",
                        "Once approved, I'll create your piece",
                        "Delivery or collection when ready",
                      ].map((step, i) => (
                        <motion.li
                          key={i}
                          className="flex gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <span className="h-6 w-6 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center shrink-0 text-xs font-medium">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </motion.li>
                      ))}
                    </ol>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile sticky footer */}
      <MobileStickyFooter
        estimatedPrice={estimatedPrice}
        progress={formProgress}
        isSubmitting={isSubmitting}
        canSubmit={formData.consent}
        onSubmit={() => {
          const form = document.querySelector("form");
          if (form) form.requestSubmit();
        }}
      />

      <Footer />
    </>
  );
}
