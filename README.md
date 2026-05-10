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

The dashboard allows users to monitor retail sales performance, analyze revenue trends, forecast future sales using ARIMA and LSTM models, identify customer segments, and generate product recommendations. It converts raw retail datasets into actionable business insights through interactive charts, analytics modules, and machine learning-based forecasting systems.

# Features

The dashboard includes multiple analytics modules designed to provide meaningful retail business insights. It provides revenue and sales trend analysis through monthly and daily visualizations. The forecasting module uses ARIMA and LSTM models to predict future revenue trends and compare historical and forecasted performance. The customer segmentation module analyzes customer groups and purchasing behavior, while the recommendation system provides product recommendations using Random Forest and Apriori algorithms. The platform also includes KPI tracking, business insights, and responsive dashboard visualizations for better decision-making.

# Dashboard Modules

The Overview section displays important business KPIs such as total revenue, total transactions, average sales value, top-performing categories, revenue distribution, and business health indicators. The Sales Trends section provides monthly and daily sales analysis with historical trend comparisons and category-wise performance tracking.

The Forecasting section visualizes historical and future revenue predictions using ARIMA and LSTM models along with confidence intervals and model performance comparisons. The Customer Segmentation section presents customer distribution, demographic analysis, and spending behavior insights. The Product Recommendations section displays frequently purchased products, recommendation patterns, and association rule analysis. The Business Insights section provides retail performance indicators, strategic recommendations, and overall business analysis.

# Technologies Used

The frontend of the project was developed using React, TypeScript, Vite, Tailwind CSS, Recharts, and React Router. The backend was built using Python, Flask, Flask-CORS, and Pandas for API development and dataset handling. Machine learning and analytics components include ARIMA forecasting, LSTM forecasting, Random Forest recommendation systems, and Apriori association rule mining. Git and GitHub
 were used for version control and project management.

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
To run the project locally, Node.js, Python, Git, and VS Code should be installed on the system. The repository can be cloned using Git, and frontend dependencies can be installed using npm install. The frontend application can then be started using npm run dev. The backend server can be started by installing Flask-related dependencies and running the Flask application file using python app.py.

# Frontend and Backend Integration
The frontend dashboard fetches data from Flask API endpoints using REST API calls.

Example:
fetch("http://127.0.0.1:5000/monthly")
  .then(res => res.json())
  .then(data => setMonthly(data));

  The backend reads CSV datasets using Pandas and returns JSON responses to the frontend dashboard.

# Machine Learning Models Used

The project uses ARIMA and LSTM models for revenue forecasting and trend prediction. ARIMA is used for time-series forecasting and seasonal sales analysis, while LSTM is used for deep learning-based sequential forecasting. The recommendation system uses Random Forest algorithms for predictive recommendations and Apriori algorithms for market basket analysis and association rule mining.

# Screenshots

The Screenshots folder contains dashboard previews for the Overview, Forecasting, Sales Trends, and Customer Segmentation modules. These screenshots demonstrate the user interface, chart visualizations, KPI sections, and analytics features implemented in the dashboard.

# Author 
Snehal Dnyane
BTech Computer Science Engineering Student




  




