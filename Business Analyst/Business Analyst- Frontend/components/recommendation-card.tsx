//components/recommendation-card.tsx

"use client";

import { ArrowUpRight, BarChart3, Clock, DollarSign, Percent, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter  } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecommendationResponse } from "@/lib/api";

interface RecommendationCardProps {
  recommendation: RecommendationResponse;
  onViewDetails: (recommendation: RecommendationResponse) => void;
}

export function RecommendationCard({ recommendation, onViewDetails }: RecommendationCardProps) {
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
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{recommendation.title}</CardTitle>
          <Badge className={getRiskColor(recommendation.riskLevel)}>
            {recommendation.riskLevel} Risk
          </Badge>
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {recommendation.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Investment</p>
                  <p className="font-medium">${recommendation.investmentRequired.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className="font-medium">{recommendation.roi}%</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Time to Profit</p>
                  <p className="font-medium">{recommendation.timeToProfit}</p>
                </div>
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Market Trends</p>
                  {/* Display available trend data */}
                  {recommendation.marketTrends && (
                      <p className="font-medium">
                        Latest Value: {recommendation.marketTrends.values[recommendation.marketTrends.values.length - 1]}
                      </p>
                  )}

                </div>
              </div>
            </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full group"
          onClick={() => onViewDetails(recommendation)}
        >
          View Details
          <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}