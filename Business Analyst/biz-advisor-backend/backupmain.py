from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pydantic import BaseModel, ValidationError
import os
from dotenv import load_dotenv
import json
import re
from typing import List

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your React app's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Data model for user input (request body)
class BusinessInput(BaseModel):
    industry: str
    budget: float
    location: str

# Data model for market trend data (used in both endpoints)
class MarketTrendData(BaseModel):
    dates: List[str]
    values: List[float]

# Data model for the recommendation API response
class RecommendationResponse(BaseModel):
    id: str
    title: str
    description: str
    investmentRequired: float
    roi: float
    riskLevel: str
    timeToProfit: str
    marketTrends: MarketTrendData
    keyBenefits: List[str] = []

# Data Model for Market Trend endpoint (NOW DEFINED BEFORE USE)
class MarketTrendResponse(BaseModel):
    industry: str
    trend: MarketTrendData



@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendation(data: BusinessInput):
    try:
        print(data)
        prompt = f"""
        Suggest a business idea for the {data.industry} industry,
        with a budget of {data.budget}, located in {data.location}.
        Provide a concise title, a short description, an estimated investment required (as a number, without currency symbols),
        an estimated ROI (Return on Investment) as a percentage (a number, without the % symbol),
        a risk level (Low, Medium, or High), and an estimated time to profitability (e.g., "6-12 months").

        Provide market trend data with keys 'dates' as an array of strings, and 'values' as an array of numbers representing the percentage of the market growth:

        Also, provide a list of *at least three* key benefits of this business idea, as an array of strings with the key 'keyBenefits'.  These should be specific, concise benefits.

        Return ONLY a JSON object in the following format, with NO surrounding text or Markdown:

        ```json
        {{
          "id": "<unique id>",
          "title": "<business title>",
          "description": "<short description>",
          "investmentRequired": <estimated investment>,
          "roi": <estimated ROI percentage>,
          "riskLevel": "<Low, Medium, or High>",
          "timeToProfit": "<estimated time>",
          "marketTrends": {{
            "dates": ["2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"],
            "values": [10, 15, 18, 22, 25, 28]
          }},
          "keyBenefits": ["<Benefit 1>", "<Benefit 2>", "<Benefit 3>"]
        }}
        ```
        """

        model = genai.GenerativeModel("gemini-2.0-pro-exp-02-05") # Use Correct Model Name.
        response = model.generate_content(prompt)
        print(response.text) #To check response

        # Extract JSON from the response (handle Markdown and plain text)
        try:
            if "```json" in response.text:
                # Extract JSON string from Markdown
                json_string = re.search(r"```json\n(.*?)```", response.text, re.DOTALL).group(1)
            elif "```" in response.text:  #Handle cases where it's just ```
                json_string = re.search(r"```(.*?)```", response.text, re.DOTALL).group(1)
            else:
                json_string = response.text  # Assume it's raw JSON (risky, but a fallback)

            json_response = json.loads(json_string)  # Use the json module

        except (json.JSONDecodeError, AttributeError) as parse_error:
            print(f"Raw response from Gemini: {response.text}") #VERY important for debugging
            raise HTTPException(status_code=500, detail=f"Failed to parse Gemini response as JSON: {parse_error}")

        # Validate the parsed JSON against the Pydantic model.  This *includes* marketTrends now.
        validated_response = RecommendationResponse(**json_response)
        return validated_response

    except ValidationError as validation_error:
        print(f"Pydantic validation error: {validation_error}")
        raise HTTPException(status_code=422, detail=f"Gemini response did not match expected format: {validation_error}") #  422 error

    except Exception as e:
        # Log the full error for debugging
        print(f"Error in /recommend endpoint: {e}")
        # Raise an HTTPException to return a proper error to the client
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/market-trends", response_model=MarketTrendResponse)  # Use the new response model
async def get_market_trends(industry: str = Query(..., title="Industry", description="The industry for which to fetch market trends")):
    try:
        prompt = f"""
        Provide market trend data for the {industry} industry.
        Return ONLY a JSON object, with NO surrounding text or Markdown.

        The JSON object MUST have the following format:

        {{
          "industry": "{industry}",
          "trend": {{
            "dates": ["2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"],
            "values": [10, 15, 22, 28, 35, 42]  # Example values
          }}
        }}
        """

        model = genai.GenerativeModel("gemini-2.0-pro-exp-02-05") # Use the same model
        response = model.generate_content(prompt)
        print("Market Trend Response:", response.text)

        try:
            if "```json" in response.text:
                json_string = re.search(r"```json\n(.*?)```", response.text, re.DOTALL).group(1)
            elif "```" in response.text:
                json_string = re.search(r"```(.*?)```", response.text, re.DOTALL).group(1)
            else:
                json_string = response.text
            json_response = json.loads(json_string)
        except (json.JSONDecodeError, AttributeError) as e:
            print(f"JSON parsing error: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to parse market trend response: {e}")
        # Validate using Pydantic
        validated_response = MarketTrendResponse(**json_response)
        return validated_response

    except ValidationError as e:
      print(f"Pydantic validation error: {e}")
      raise HTTPException(status_code=422, detail=f"Invalid market trend data format received: {e}") #422 error

    except Exception as e:
        print(f"Error in /market-trends endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))