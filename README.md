# AI-Based Platform for Students

## 🚀 Overview
An intelligent platform designed to help students and aspiring entrepreneurs make informed business decisions. The platform leverages AI to provide personalized business recommendations, market trend analysis, and strategic insights based on user inputs.

## ✨ Features

- **AI-Powered Business Recommendations**
  - Personalized business ideas based on industry, budget, and location
  - Detailed ROI analysis and risk assessment
  - Comprehensive business model descriptions

- **Market Trend Analysis**
  - Real-time market trend predictions
  - Historical data visualization
  - Industry-specific growth analysis

- **Interactive Dashboard**
  - Modern, responsive user interface
  - Data visualization with charts and graphs
  - User-friendly input forms

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 13
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Charts**: Chart.js, Recharts
- **Form Handling**: React Hook Form
- **Type Safety**: TypeScript

### Backend
- **Framework**: FastAPI
- **AI Integration**: Google Gemini AI
- **API Documentation**: OpenAPI/Swagger
- **Data Validation**: Pydantic

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone [https://github.com/meghaagarwaal/AI-BASED-PLATFORM-FOR-STUDENTS]
```

2. **Frontend Setup**
```bash
cd "Business Analyst/Business Analyst- Frontend"
npm install
```

3. **Backend Setup**
```bash
cd "Business Analyst/biz-advisor-backend"
pip install -r requirements.txt
```

4. **Environment Setup**
- Create a `.env` file in the backend directory with your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

### Running the Application

1. **Start the Backend**
```bash
cd "Business Analyst/biz-advisor-backend"
uvicorn main:app --reload
```

2. **Start the Frontend**
```bash
cd "Business Analyst/Business Analyst- Frontend"
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 📚 API Documentation

The backend API documentation is available at:
```
http://localhost:8000/docs
```

### Key Endpoints

- `POST /recommend`
  - Get personalized business recommendations
  - Input: industry, budget, location
  - Output: detailed business proposal with ROI and market analysis

- `GET /market-trends`
  - Get market trend analysis for specific industries
  - Input: industry name
  - Output: trend data and analysis


This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for providing the AI capabilities
- The open-source community for the amazing tools and libraries 
