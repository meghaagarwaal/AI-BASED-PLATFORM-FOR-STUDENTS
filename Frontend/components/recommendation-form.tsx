"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2, DollarSign, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RecommendationRequest, getRecommendations, saveSearch } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
  budget: z.coerce.number().positive({
    message: "Budget must be a positive number.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
});

interface RecommendationFormProps {
  onSubmit: (data: RecommendationRequest) => void;
  isLoading: boolean;
}

export function RecommendationForm({ onSubmit, isLoading }: RecommendationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      budget: 50000,
      location: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Save the search to history
      saveSearch(values);
      
      // Call the parent component's onSubmit function
      onSubmit(values);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="e.g. Technology" 
                      className="pl-10 transition-all focus:ring-2 focus:ring-primary/20" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter your business industry
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="number" 
                      placeholder="50000" 
                      className="pl-10 transition-all focus:ring-2 focus:ring-primary/20" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Your available investment budget
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="e.g. New York" 
                      className="pl-10 transition-all focus:ring-2 focus:ring-primary/20" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Where you plan to operate
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full md:w-auto transition-all hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Generating Recommendations...
            </>
          ) : (
            "Get Business Recommendations"
          )}
        </Button>
      </form>
    </Form>
  );
}