"use client";
import React from "react";
import { ArrowLeft, BarChart3, Clock, DollarSign, Percent, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketTrendChart } from "@/components/market-trend-chart";
import { RecommendationResponse } from "@/lib/api";

interface RecommendationDetailsProps {
  recommendation: RecommendationResponse;
  onBack: () => void;
}

export function RecommendationDetails({ recommendation, onBack }: RecommendationDetailsProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recommendations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <CardTitle className="text-2xl font-bold">{recommendation.title}</CardTitle>
              <Badge className={getRiskColor(recommendation.riskLevel)}>
                {recommendation.riskLevel} Risk
              </Badge>
            </div>
            <CardDescription className="mt-2">
              {recommendation.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Financial Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Required Investment</p>
                      <p className="font-medium">${recommendation.investmentRequired.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Percent className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Expected ROI</p>
                      <p className="font-medium">{recommendation.roi}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Timeline & Risk</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time to Profitability</p>
                      <p className="font-medium">{recommendation.timeToProfit}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ShieldAlert className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <p className="font-medium">{recommendation.riskLevel}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Key Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Conditional rendering for key benefits */}
            {recommendation.keyBenefits && recommendation.keyBenefits.length > 0 ? (
              <ul className="space-y-2">
                {recommendation.keyBenefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 p-1 mr-2 mt-0.5">
                      <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Key benefits analysis in progress...</p>
            )}
          </CardContent>
        </Card>
      </div>

        {recommendation.marketTrends && (
          <MarketTrendChart
          data={recommendation.marketTrends} // Pass the marketTrends data here
          title={`${recommendation.title} - Market Growth Trends`}
          description="Projected market growth over the next 6 months"
          isLoading={false} // Add an isLoading prop here
          />
        )}
    </div>
  );
}