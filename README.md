# AI Retail Analytics Dashboard
Overview

AI Retail Analytics Dashboard is a full-stack business intelligence and analytics platform developed to analyze retail sales data, generate future revenue forecasts, identify customer segments, and provide product recommendations through machine learning models.
The project combines a React + TypeScript frontend dashboard with a Flask backend API connected to multiple CSV datasets. The dashboard presents retail insights through interactive charts, KPI cards, and forecasting visualizations.
The initial frontend UI structure was generated using Lovable AI
and later customized with backend APIs, dataset integration, forecasting modules, and analytics features.

# Project Objective

Retail businesses generate large amounts of sales and customer data every day, but extracting meaningful insights from this data can be difficult without proper analytics tools.
The objective of this project is to create an AI-powered retail analytics platform that helps analyze sales performance, understand customer behavior, predict future revenue trends, and generate product recommendations using machine learning techniques.
The dashboard is designed to support data-driven business decisions through interactive visualizations, forecasting models, and recommendation systems.

# What This Project Does

The dashboard allows users to:
- Monitor retail sales performance
- Analyze revenue trends
- Forecast future sales using ARIMA and LSTM models
- Identify customer segments
- Generate product recommendations
- Visualize business KPIs through interactive charts

The system converts raw retail datasets into actionable business insights.

# Features

Interactive multi-page analytics dashboard
Revenue and sales trend analysis
Monthly and daily sales visualization
ARIMA and LSTM-based revenue forecasting
Customer segmentation analysis
Product recommendation system
Market basket analysis using Apriori algorithm
Business KPI tracking
Responsive dashboard UI
Backend API integration using Flask

# Dashboard Modules

Overview
Displays:
Total revenue
Total transactions
Average sales value
Top-performing category
Business health score
Revenue distribution charts

Sales Trends
Provides:
Monthly sales trends
Daily revenue analysis
Category-wise performance tracking
Historical trend comparison

Forecasting
Includes:
Historical vs forecasted revenue
ARIMA predictions
LSTM predictions
Confidence interval visualization
Model performance comparison

Customer Segmentation
Shows:
Customer segment distribution
Demographic analysis
Spending behavior patterns
Segment-based business insights

Product Recommendations
Provides:
Frequently purchased products
Recommendation patterns
Association rule analysis
Recommendation confidence metrics

Business Insights
Contains:
Retail performance indicators
Business recommendations
Strategic insights
Category analysis

# Technologies Used

Frontend
React
TypeScript
Vite
Tailwind CSS
Recharts
React Router

Backend
Python
Flask
Flask-CORS
Pandas

Machine Learning & Analytics
ARIMA Forecasting
LSTM Forecasting
Random Forest Recommendation System
Apriori Algorithm

Version Control
Git
GitHub

# Project Structure
AI-Retail-Analytics-Dashboard/
│
├── Backend/
│   ├── app.py
│   └── data/
│       ├── retail_cleaned.csv
│       ├── monthly_data.csv
│       ├── daily_data.csv
│       ├── lstm_future_forecast.csv
│       ├── arima_future_forecast.csv
│       ├── model_comparison.csv
│       ├── customer_segments.csv
│       ├── rf_recommendations.csv
│       └── apriori_rules.csv
│
├── Screenshots/
│
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   │   └── dashboard/
│   └── App.tsx
│
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md

# Dataset Files

| File Name                 | Purpose                        |
| ------------------------- | ------------------------------ |
| retail_cleaned.csv        | Main retail dataset            |
| monthly_data.csv          | Monthly aggregated sales data  |
| daily_data.csv            | Daily sales analysis           |
| lstm_future_forecast.csv  | LSTM forecasting output        |
| arima_future_forecast.csv | ARIMA forecasting output       |
| model_comparison.csv      | Forecast model comparison      |
| customer_segments.csv     | Customer segmentation results  |
| rf_recommendations.csv    | Product recommendation results |
| apriori_rules.csv         | Association rule mining output |


# API Endpoints
The Flask backend provides REST API endpoints for dashboard integration.

| Endpoint         | Description                |
| ---------------- | -------------------------- |
| /cleaned         | Main cleaned dataset       |
| /monthly         | Monthly sales data         |
| /daily           | Daily sales data           |
| /lstm            | LSTM forecast data         |
| /arima           | ARIMA forecast data        |
| /comparison      | Forecast model comparison  |
| /segments        | Customer segmentation data |
| /recommendations | Product recommendations    |
| /rules           | Apriori association rules  |

# Installation and Setup
Prerequisites
Install the following before running the project:
Node.js
Python
Git
VS Code

# Frontend and Backend Integration
The frontend dashboard fetches data from Flask API endpoints using REST API calls.

Example:
fetch("http://127.0.0.1:5000/monthly")
  .then(res => res.json())
  .then(data => setMonthly(data));

  The backend reads CSV datasets using Pandas and returns JSON responses to the frontend dashboard.

# Machine Learning Models Used

ARIMA
Used for:
Time-series forecasting
Revenue trend prediction
Seasonal analysis

LSTM
Used for:
Deep learning-based forecasting
Sequential trend analysis
Future revenue prediction

Random Forest
Used for:
Product recommendation analysis
Predictive recommendation generation

Apriori Algorithm
Used for:
Market basket analysis
Association rule mining
Frequently bought together analysis


  




