

from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os
import json
import math

app = Flask(__name__)
CORS(app)

BASE = os.path.join(os.path.dirname(__file__), "data")

cleaned  = pd.read_csv(f"E:\\Finance\\viz-arcana\\Backend\\Data\\retail_cleaned.csv")
monthly  = pd.read_csv(f"E:\\Finance\\viz-arcana\\Backend\\Data\\monthly_data.csv")
daily    = pd.read_csv(f"E:\\Finance\\viz-arcana\\Backend\\Data\\daily_data.csv")
lstm     = pd.read_csv(f"E:\\Finance\\viz-arcana\\Backend\\Data\\lstm_future_forecast.csv")
arima    = pd.read_csv(f"E:\\Finance\\viz-arcana\\Backend\\Data\\arima_future_forecast.csv")
comp     = pd.read_csv(f"E:\\Finance\\viz-arcana\\Backend\\Data\\model_comparison.csv")
segments = pd.read_csv(f"E:\\Finance\\viz-arcana\\Backend\\Data\\customer_segments.csv")
recs     = pd.read_csv(f"E:\\Finance\\viz-arcana\\Backend\\Data\\rf_recommendations.csv")
rules    = pd.read_csv(f"E:\\Finance\\viz-arcana\\Backend\\Data\\apriori_rules.csv")

def safe_json(df):
    records = df.to_dict(orient='records')
    for row in records:
        for k, v in row.items():
            if isinstance(v, float) and math.isnan(v):
                row[k] = 0
    return jsonify(records)

@app.route('/monthly')
def get_monthly():
    return safe_json(monthly)

@app.route('/cleaned')
def get_cleaned():
    return safe_json(cleaned)

@app.route('/daily')
def get_daily():
    return safe_json(daily)

@app.route('/lstm')
def get_lstm():
    return safe_json(lstm)

@app.route('/arima')
def get_arima():
    return safe_json(arima)

@app.route('/comparison')
def get_comparison():
    return safe_json(comp)

@app.route('/segments')
def get_segments():
    return safe_json(segments)

@app.route('/recommendations')
def get_recommendations():
    return safe_json(recs)

@app.route('/rules')
def get_rules():
    return safe_json(rules)

@app.route('/categories')
def get_categories():
    cats = cleaned.groupby('Product Category')['Total Spent'].sum().reset_index()
    cats.columns = ['category', 'revenue']
    cats = cats.sort_values('revenue', ascending=False)
    return safe_json(cats)

@app.route('/monthly-by-category')
def get_monthly_by_category():
    df = cleaned.copy()
    df['Month'] = pd.to_datetime(df['Date']).dt.to_period('M').astype(str)
    result = df.groupby(['Month', 'Product Category'])['Total Spent'].sum().reset_index()
    result.columns = ['month', 'category', 'revenue']
    return safe_json(result)

@app.route('/yearly')
def get_yearly():
    result = cleaned.groupby('Year')['Total Spent'].sum().reset_index()
    result.columns = ['year', 'revenue']
    return safe_json(result)

if __name__ == '__main__':
    app.run(debug=True)