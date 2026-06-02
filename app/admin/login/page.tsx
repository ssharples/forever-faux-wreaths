"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { useAction, useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AdminLogo } from "@/components/admin/admin-logo";
import { Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";

export default function AdminLogin() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const setupStatus = useQuery(api.admin.getSetupStatus);
  const currentUser = useQuery(api.users.current);
  const bootstrapAdminAccount = useAction(api.admin.bootstrapAdminAccount);

  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    router.replace(currentUser.role === "admin" ? "/admin" : "/account");
  }, [currentUser, router]);

  useEffect(() => {
    if (!setupStatus) return;

    if (!setupStatus.adminExists || !setupStatus.adminHasPasswordAccount) {
      setStep("signUp");
      return;
    }

    setStep("signIn");
  }, [setupStatus]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const name = String(formData.get("name") || "") || undefined;

    try {
      if (step === "signUp") {
        await bootstrapAdminAccount({
          email,
          password,
          name,
        });
        formData.set("flow", "signIn");
      } else {
        formData.set("flow", "signIn");
      }

      await signIn("password", formData);
      toast.success(step === "signIn" ? "Signed in successfully" : "Signed up successfully");
    } catch (error) {
      console.error(error);
      toast.error("Authentication failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 p-4">
      <Card className="w-full max-w-md p-8 border-cream-300 bg-white">
        <div className="text-center mb-8">
          <AdminLogo size="lg" className="mx-auto mb-4" />
          <h1 className="text-2xl font-display text-charcoal-700">Admin Access</h1>
          <p className="text-charcoal-500 text-sm mt-2">
            {setupStatus?.adminExists
              ? setupStatus.adminHasPasswordAccount
                ? "Please sign in to manage your store"
                : "Finish setting up the reserved admin account with the same email address."
              : "Create the initial admin account to unlock the backend"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === "signUp" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Admin name"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={step === "signIn" ? "current-password" : "new-password"}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-sage-400 hover:bg-sage-500 text-white"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {step === "signIn" ? "Sign In" : "Sign Up"}
          </Button>
          
          {(!setupStatus?.adminExists || !setupStatus?.adminHasPasswordAccount) && (
            <Button
              type="button"
              variant="ghost"
              className="w-full mt-2 text-sm text-charcoal-500"
              onClick={() => setStep(step === "signIn" ? "signUp" : "signIn")}
            >
              {step === "signIn"
                ? "Need to set up the initial admin account?"
                : "Already have an account? Sign in"}
            </Button>
          )}
        </form>
      </Card>
    </div>
  );
}
