"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Building2, Clock, DollarSign, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSearchHistory, RecommendationRequest } from "@/lib/api";

interface SearchHistoryItem extends RecommendationRequest {
  id: string;
  timestamp: string;
}

export function RecentSearches() {
  const [searches, setSearches] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const history = getSearchHistory();
    setSearches(history);
  }, []);

  if (searches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Searches</CardTitle>
          <CardDescription>Your recent business recommendation searches</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">
            No recent searches found. Start by submitting a recommendation request.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Searches</CardTitle>
        <CardDescription>Your recent business recommendation searches</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {searches.map((search) => (
            <div 
              key={search.id} 
              className="flex flex-col space-y-2 p-3 border rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{search.industry}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(search.timestamp), "MMM d, yyyy")}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>${search.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>{search.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}