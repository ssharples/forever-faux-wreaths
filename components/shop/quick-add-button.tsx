"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useCartSession } from "@/lib/cart-session";
import type { Id } from "@/convex/_generated/dataModel";

type QuickAddButtonProps = {
  productId: Id<"products">;
  productTitle: string;
  disabled?: boolean;
  className?: string;
};

export function QuickAddButton({
  productId,
  productTitle,
  disabled = false,
  className,
}: QuickAddButtonProps) {
  const sessionId = useCartSession();
  const addToCart = useMutation(api.cart.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!sessionId || disabled || isAdding) return;

    setIsAdding(true);
    try {
      await addToCart({
        sessionId,
        productId,
        quantity: 1,
      });
      toast.success(`${productTitle} added to cart`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add to cart"
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      size="sm"
      className={className}
      disabled={disabled || isAdding}
      onClick={handleClick}
    >
      {isAdding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Quick Add
        </>
      )}
    </Button>
  );
}
