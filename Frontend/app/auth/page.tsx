"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart2 } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { useAuth } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, isLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleSubmit = async (data: any) => {
    try {
      let success;
      
      if (mode === "login") {
        success = await login(data.email, data.password);
      } else {
        success = await signup(data.email, data.password, data.name);
      }
      
      if (success) {
        toast({
          title: "Success",
          description: mode === "login" ? "Logged in successfully!" : "Account created successfully!",
        });
        router.push("/dashboard");
      } else {
        throw new Error(mode === "login" ? "Login failed" : "Signup failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-8 w-8" />
              <span className="font-bold text-2xl">Business AI</span>
            </div>
            <h1 className="mt-4 text-2xl font-bold">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {mode === "login" 
                ? "Sign in to your account to continue" 
                : "Sign up to get started with our platform"}
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <AuthForm
              mode={mode}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onToggleMode={toggleMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}