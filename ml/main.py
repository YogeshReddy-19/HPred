from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

model = joblib.load(os.path.join(MODEL_DIR, "model.pkl"))
feature_names = joblib.load(os.path.join(MODEL_DIR, "features.pkl"))

app = FastAPI(title="House Price Prediction API",)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://h-pred.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HouseInput(BaseModel):
    bedrooms: int
    bathrooms: float
    sqft_living: float
    sqft_lot: float
    floors: float
    waterfront: int
    view: int
    condition: int
    sqft_above: float
    sqft_basement: float
    yr_built: int
    yr_renovated: int
    lat: float
    long: float
    grade: int

def create_features(df: pd.DataFrame):
    df = df.copy()
    CURRENT_YEAR = datetime.now().year
    df['house_age'] = CURRENT_YEAR - df['yr_built']
    df['renovation_age'] = np.where(df['yr_renovated'] == 0,0,CURRENT_YEAR - df['yr_renovated'])
    df['sqft_grade'] = (np.log1p(df['sqft_living']) *df['grade'])
    df['room_d'] = (df['bathrooms'] *df['bedrooms'] *df['grade'])
    df['bath_per_bedroom'] = (df['bathrooms'] / (df['bedrooms'] + 1))
    df['is_renovated'] = (df['yr_renovated'] > 0).astype(int)
    df['total_sqft'] = (df['sqft_above'] +df['sqft_basement'])
    df['luxury_score'] = (df['grade'] *df['view'] *(df['waterfront'] + 1))
    return df

@app.get("/")
def home():
    return {"message": "API is running"}

@app.post("/predict")
def predict(data: HouseInput):
    try:
        input_dict = data.model_dump()
        input_df = pd.DataFrame([input_dict])
        input_df = create_features(input_df)
        input_df = input_df[feature_names]
        pred_log = model.predict(input_df)[0]
        prediction = np.expm1(pred_log)
        return {"predicted_price": float(prediction)}

    except Exception as e:
        return {"error": str(e)}