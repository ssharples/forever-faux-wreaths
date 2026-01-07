"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  variant?: "default" | "footer" | "hero";
}

export function NewsletterForm({ variant = "default" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // This will be connected to Convex once the backend is deployed
  // const subscribe = useMutation(api.newsletterSubscribers.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Simulated for now - will connect to Convex
      // const result = await subscribe({ email });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubscribed(true);
      setEmail("");
      toast.success("Thank you for subscribing!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div
        className={cn(
          "flex items-center gap-2",
          variant === "footer" && "text-cream-300",
          variant === "hero" && "text-charcoal-600",
          variant === "default" && "text-charcoal-600"
        )}
      >
        <CheckCircle className="h-5 w-5 text-sage-400" />
        <span className="text-sm">Thank you for subscribing!</span>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="bg-charcoal-500 border-charcoal-400 text-cream-100 placeholder:text-cream-500 focus-visible:ring-sage-400"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-sage-400 hover:bg-sage-500 text-white shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
    );
  }

  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-10 h-12 bg-white border-cream-400 focus-visible:ring-sage-400"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="bg-sage-400 hover:bg-sage-500 text-white h-12"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
    );
  }

  // Default variant
  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1"
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-sage-400 hover:bg-sage-500 text-white"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
      </Button>
    </form>
  );
}
