import Image from "next/image";
import { cn } from "@/lib/utils";

interface AdminLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function AdminLogo({ size = "md", className }: AdminLogoProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full bg-cream-100",
        sizeClasses[size],
        className
      )}
    >
      <Image
        src="/images/logo.webp"
        alt="Forever Faux Wreaths"
        fill
        sizes={size === "sm" ? "32px" : size === "lg" ? "48px" : "40px"}
        className="object-cover"
        priority
      />
    </div>
  );
}
