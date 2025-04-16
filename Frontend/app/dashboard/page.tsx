"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { RecommendationForm } from "@/components/recommendation-form";
import { RecommendationCard } from "@/components/recommendation-card";
import { RecommendationDetails } from "@/components/recommendation-details";
import { MarketTrendChart } from "@/components/market-trend-chart";
import { RecentSearches } from "@/components/recent-searches";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/lib/auth";
import {
  RecommendationRequest,
  RecommendationResponse,
  getRecommendations,
  getMarketTrends,
  MarketTrend
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast"; // Corrected import

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationResponse | null>(null);
  const [marketTrend, setMarketTrend] = useState<MarketTrend | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RecommendationRequest | null>(null); //Keep track of form data

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  const handleFormSubmit = async (data: RecommendationRequest) => {
    setIsLoading(true);
    setFormData(data);  // Store the form data
    setSelectedRecommendation(null); // Clear previous selection
    setRecommendations([]);// Clear previous recommendations

    try {
      const recommendation = await getRecommendations(data); // Get a *single* recommendation
      setRecommendations([recommendation]); // Put it in an array

      // Get Market Trends (still mocked for now)
      const trend = await getMarketTrends(data.industry);
      setMarketTrend(trend);

    } catch (error) {
        console.error("Error fetching recommendations or market trends:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive"
        });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (recommendation: RecommendationResponse) => {
    setSelectedRecommendation(recommendation);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setSelectedRecommendation(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Business Recommendation Dashboard</h1>
            <p className="text-muted-foreground">
              Enter your business criteria to get AI-powered recommendations
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <RecommendationForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-muted-foreground">Analyzing market data and generating recommendations...</p>
            </div>
          ) : selectedRecommendation ? (
            <RecommendationDetails
              recommendation={selectedRecommendation}
              onBack={handleBackToList}
            />
          ) : (
            <>
              {recommendations.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Recommended Business Opportunities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((recommendation) => (
                      <RecommendationCard
                        key={recommendation.id}
                        recommendation={recommendation}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                </div>
              )}

              {marketTrend && (
                <div className="mt-8">
                  <MarketTrendChart
                    data={marketTrend.trend} // Pass marketTrend.trend, as before
                    title={`${formData ? formData.industry: "Market"} - Market Growth Trends`} // Use stored form data
                    description="Projected market growth over the next 5 years"
                  />
                </div>
              )}

              <div className="mt-8">
                <RecentSearches />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}