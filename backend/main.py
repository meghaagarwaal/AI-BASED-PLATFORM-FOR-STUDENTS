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

# --- Data Models ---
class BusinessInput(BaseModel):
    industry: str
    budget: float
    location: str

class MarketTrendData(BaseModel):
    dates: List[str]
    values: List[float]
    trendAnalysis: str  # Keep this!  It's a good addition.

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
    whyThisBusiness: str = ""

# Data Model for Market Trend endpoint
class MarketTrendResponse(BaseModel):
    industry: str
    trend: MarketTrendData

# --- API Endpoints ---

@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendation(data: BusinessInput):
    try:
        print(data)
        prompt = f"""You are a business consultant AI.  Your task is to provide a JSON object representing a viable business idea.  Do NOT include any text outside of the JSON object.

        The JSON object MUST have the following structure:

        ```json
        {{
          "id": "<unique id>",
          "title": "<business title>",
          "description": "<detailed business model & revenue strategy>",
          "investmentRequired": <numeric amount>,
          "roi": <expected ROI in percentage, should be extremely correct, even if low or high>,
          "riskLevel": "<Low, Medium, or High>",
          "timeToProfit": "<expected time to profitability>",
          "marketTrends": {{
            "dates": ["2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"],
            "values": [10, 15, 20, 25, 30, 35],
            "trendAnalysis": "<Brief explanation of why these values are increasing/decreasing>"
          }},
          "keyBenefits": ["<Benefit 1>", "<Benefit 2>", "<Benefit 3>"],
          "whyThisBusiness": "<Explain why this idea is profitable & sustainable>"
        }}
        ```

        Input parameters:
        * Industry: {data.industry}
        * Budget: {data.budget}
        * Location: {data.location}

        Constraints:
        *   **id:** A unique string identifier (you can generate this).
        *   **title:** Short and catchy.
        *   **description:**  Detailed explanation of the business model and how it generates revenue.
        *   **investmentRequired:**  A NUMBER, without currency symbols.
        *   **roi:**  A NUMBER representing the percentage (e.g., 25 for 25%).  Do NOT include a "%" sign.
        *   **riskLevel:**  MUST be one of "Low", "Medium", or "High".
        *   **timeToProfit:**  An estimated time frame (e.g., "6-12 months").
        *   **marketTrends:**  An object with "dates" (array of strings) and "values" (array of numbers).  The values should represent a relevant metric like market growth percentage.
        *   **trendAnalysis:** Brief explanation of why these values are increasing/decreasing.
        *   **keyBenefits:** An array of at *LEAST* three strings. Each string should be a *concise* and *specific* benefit relevant to the industry, location, and budget.
        *   **whyThisBusiness:** A short paragraph explaining *why* this is a good business idea, considering profitability and sustainability.

        Return ONLY the JSON object.  Do NOT include any Markdown, introductory text, or concluding remarks. The response should start with a '{' and end with a '}'.
        """

        model = genai.GenerativeModel("gemini-2.0-pro-exp-02-05")  # Use correct model name if needed
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

        # Validate the parsed JSON against the Pydantic model (this includes marketTrends).
        validated_response = RecommendationResponse(**json_response)
        return validated_response

    except ValidationError as validation_error:
        print(f"Pydantic validation error: {validation_error}")
        raise HTTPException(
            status_code=422,
            detail=f"Gemini response did not match expected format: {validation_error}"
        )

    except Exception as e:
        print(f"Error in /recommend endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/market-trends", response_model=MarketTrendResponse)
async def get_market_trends(industry: str = Query(..., title="Industry", description="The industry for which to fetch market trends")):
    try:
        prompt = f"""You are an AI expert in **market analytics**.

### **TASK:**
Provide market trend data for the `{industry}` industry.
Analyze **past growth**, **present condition**, and **predict future trends.**

### **OUTPUT FORMAT:**
Return **ONLY** a JSON object (no Markdown, no text, no explanations).

```json
{{
  "industry": "{industry}",
  "trend": {{
    "dates": ["2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"],
    "values": [10, 15, 22, 28, 35, 42],
    "trendAnalysis": "<Brief explanation of why these values are increasing/decreasing>"
  }}
}}
INSTRUCTIONS FOR AI:
Dates: Predict growth for 6 upcoming quarters.
Values: Percentage increase over time. Keep values realistic.
Trend Analysis: Explain why the trend is moving up or down.
⚠️ IMPORTANT:
DO NOT add text, explanations, or markdown.
ONLY return a valid JSON object.
"""

        model = genai.GenerativeModel("gemini-2.0-pro-exp-02-05")
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
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse market trend response: {e}"
            )

        validated_response = MarketTrendResponse(**json_response)
        return validated_response

    except ValidationError as e:
        print(f"Pydantic validation error: {e}")
        raise HTTPException(
            status_code=422,
            detail=f"Invalid market trend data format received: {e}"
        )
    except Exception as e:
        print(f"Error in /market-trends endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
