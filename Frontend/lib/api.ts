"use client";

import axios from 'axios';
import { toast } from "@/components/ui/use-toast" //import like this

export interface RecommendationRequest {
  industry: string;
  budget: number; // Keep as number
  location: string;
}

export interface RecommendationResponse {
    id: string;
    title: string;
    description: string;
    investmentRequired: number;
    roi: number;
    riskLevel: string;
    timeToProfit: string;
    marketTrends: {
        dates: string[];
        values: number[];
        trendAnalysis: string; // Add this line, VERY IMPORTANT
    };
    keyBenefits: string[]; // ADD THIS LINE
    whyThisBusiness: string;
}

export interface MarketTrend {
    industry: string;
    trend: {
      dates: string[];
      values: number[];
      trendAnalysis: string; //also add this line here
    };
}

// ... (rest of your api.ts code remains the same) ...
export const getRecommendations = async (data: RecommendationRequest): Promise<RecommendationResponse> => { // Return a single object
    try {
      const response = await axios.post<RecommendationResponse>("http://127.0.0.1:8000/recommend", data);
       // Log the response data for debugging
      return response.data; // Return the single object directly
    } catch (error) {
        if (axios.isAxiosError(error)) {
          // This is an Axios error (network, timeout, etc.)
          console.error("Axios error:", error.message);
          toast({
            title: "Network Error",
            description: `Could not connect to the server: ${error.message}`,
            variant: "destructive",
          });
        } else {
          // This is likely an error from our FastAPI backend
          console.error("API Error:", error);
            toast({
              title: "API Error",
              description: `Something went wrong with the request.`,
              variant: "destructive",
            });
        }
      throw error; // Re-throw the error so the calling function can handle it (e.g., set loading state)
    }
  };

  export const getMarketTrends = async (industry: string): Promise<MarketTrend> => {
    try {
      const response = await axios.get<MarketTrend>(`http://127.0.0.1:8000/market-trends?industry=${industry}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        toast({
          title: "Network Error",
          description: `Could not connect to the server: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.error("API Error:", error);
        toast({
          title: "API Error",
          description: "Failed to fetch market trends. Please try again.",
          variant: "destructive",
        });
      }
      throw error; // Re-throw for upstream handling.
    }
  };
  
  // Function to save a search to history (remains unchanged)
  export const saveSearch = (data: RecommendationRequest) => {
    try {
      const searches = JSON.parse(localStorage.getItem('searches') || '[]');
      searches.push({
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('searches', JSON.stringify(searches.slice(-5)));
    } catch (error) {
      console.error('Failed to save search:', error);
    }
  };
  
  // Function to get search history (remains unchanged)
  export const getSearchHistory = () => {
    try {
      return JSON.parse(localStorage.getItem('searches') || '[]');
    } catch (error) {
      console.error('Failed to get search history:', error);
      return [];
    }
  };