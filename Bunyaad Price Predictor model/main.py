# main.py
# Place this file in the SAME directory as bunyaad_price_predictor.py

import os
import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import sys

# --- Import necessary components from your existing script ---
try:
    from bunyaad_price_predictor import (
        preprocess_data,
        MODEL_SAVE_PATH,
        PREPROCESSOR_SAVE_PATH
    )
    print("Successfully imported preprocess_data and path constants from bunyaad_price_predictor.py")
except ImportError as e:
    print(f"Error importing from bunyaad_price_predictor.py: {e}")
    print("Make sure main.py is in the same directory as bunyaad_price_predictor.py "
          "and that the script doesn't have syntax errors preventing import.")
    sys.exit(1)
except Exception as e:
    print(f"An unexpected error occurred during import: {e}")
    sys.exit(1)

# --- Load Model and Preprocessor ONCE at Startup ---
model = None
preprocessor_objects = None

try:
    if not os.path.exists(MODEL_SAVE_PATH):
        raise FileNotFoundError(f"Model file not found at: {os.path.abspath(MODEL_SAVE_PATH)}")
    if not os.path.exists(PREPROCESSOR_SAVE_PATH):
         raise FileNotFoundError(f"Preprocessor file not found at: {os.path.abspath(PREPROCESSOR_SAVE_PATH)}")

    print(f"Loading model from: {MODEL_SAVE_PATH}")
    model = tf.keras.models.load_model(MODEL_SAVE_PATH)
    print("Model loaded successfully.")
    print(f"Model input shape: {model.input_shape}")
    print(f"Model output shape: {model.output_shape}")

    print(f"Loading preprocessor objects from: {PREPROCESSOR_SAVE_PATH}")
    preprocessor_objects = joblib.load(PREPROCESSOR_SAVE_PATH)
    print("Preprocessor loaded successfully.")

except FileNotFoundError as e:
    print(f"ERROR: {e}")
    print("Please ensure the model and preprocessor files exist in the 'model_files' directory "
          "relative to your script location and that the paths in bunyaad_price_predictor.py are correct.")
    sys.exit(1)
except Exception as e:
    print(f"Unexpected error loading model or preprocessor: {e}")
    sys.exit(1)

# --- Define Input Data Model using Pydantic ---
class PropertyInput(BaseModel):
    area: str
    bedroom: int
    bath: int
    location: str
    location_city: str
    type: str
    property_type: str = "Residential"
    classified_purpose: str = "Sale"

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "area": "5 Marla",
                    "bedroom": 3,
                    "bath": 2,
                    "location": "Bahria Town Phase 4",
                    "location_city": "Rawalpindi",
                    "type": "House",
                    "property_type": "Residential",
                    "classified_purpose": "Sale"
                },
                {
                    "area": "2 Kanal",
                    "bedroom": 6,
                    "bath": 6,
                    "location": "DHA Phase 6",
                    "location_city": "Lahore",
                    "type": "House",
                    "property_type": "Commercial",
                    "classified_purpose": "Sale"
                }
            ]
        }
    }

# --- Create FastAPI App ---
app = FastAPI(
    title="Bunyaad Property Price Predictor API",
    description="API to predict property prices using the trained model.",
    version="1.0.0"
)

# --- Add CORS Middleware ---
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Bunyaad Property Price Predictor API!"}

@app.post("/predict/")
async def predict_property_price(property_input: PropertyInput):
    if model is None or preprocessor_objects is None:
        print("Error: Model or Preprocessor not available.")
        raise HTTPException(
            status_code=503,
            detail="Prediction service is not ready. Model or preprocessor failed to load."
        )

    try:
        # 1. Convert Pydantic model to dictionary
        input_dict = property_input.model_dump()
        
        # 2. Create DataFrame
        input_df = pd.DataFrame([input_dict])
        print(f"Received input DataFrame:\n{input_df}")
        print(f"Raw input DataFrame columns: {input_df.columns}")
        print(f"Raw input DataFrame dtypes: {input_df.dtypes}")

        # 3. Preprocess the data
        X_processed, _, _ = preprocess_data(
            df=input_df,
            is_training=False,
            preprocessor_objects=preprocessor_objects
        )
        print(f"Processed data shape for prediction: {X_processed.shape}")

        if X_processed.empty:
            raise ValueError("Preprocessing resulted in empty data. Check input values.")

        # 4. Make Prediction
        print("Calling model.predict()...")
        X_array = np.asarray(X_processed).astype(np.float32)
        print(f"Input array shape for prediction: {X_array.shape}")
        print(f"Input array dtype: {X_array.dtype}")

        prediction_log = model.predict(X_array)
        predicted_price_log = prediction_log[0][0]
        print(f"Log-transformed prediction: {predicted_price_log}")

        # 5. Inverse Transform and convert to native Python float
        predicted_price = np.expm1(predicted_price_log) if predicted_price_log > 0 else 0
        
        # 6. Apply Commercial Property Adjustment
        if property_input.property_type.lower() == "commercial":
            # Add 60 lacs (6,000,000 PKR) for commercial properties
            commercial_adjustment = 6_000_000
            predicted_price += commercial_adjustment
            print(f"Applied commercial property adjustment: +{commercial_adjustment:,} PKR")
        
        predicted_price = round(float(predicted_price), 2)  # Convert to native float and round
        print(f"Final predicted price (PKR): {predicted_price}")

        # 7. Return Prediction
        return {"predicted_price_pkr": predicted_price}

    except ValueError as ve:
        print(f"Value Error during prediction processing: {ve}")
        raise HTTPException(status_code=400, detail=f"Error processing input: {ve}")
    except Exception as e:
        print(f"Unexpected error during prediction: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An internal server error occurred during prediction.")

# --- Run the API using Uvicorn ---
if __name__ == "__main__":
    print("Attempting to start FastAPI server using Uvicorn...")
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )