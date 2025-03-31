import sys 
import json
import pickle
import pandas as pd
import numpy as np

# Load trained model
# with open("C:/pythonn/lr_model.pkl", "rb") as file:
#     model = pickle.load(file)

import os
model_path = os.path.join(os.path.dirname(__file__), "lr_model.pkl") 

with open(model_path, "rb") as file:
    model = pickle.load(file)


# Extract correct feature names from the model
expected_columns = model.feature_names_in_  # Get correct column names

def preprocess_input(input_data):
    """ Convert raw input into a DataFrame matching model features """
    # Initialize dataframe with zeros for all expected columns
    data = {col: 0 for col in expected_columns}


    # Convert state & crop into one-hot encoded format
    state_col = f"State_{input_data['state'].strip()}"
    crop_col = f"Crop_{input_data['crop'].strip()}"

    # Assign actual values if they exist in the trained model's columns
    if state_col in data:
        data[state_col] = 1
    if crop_col in data:
        data[crop_col] = 1

    # Assign numerical values after log transformation
    data["Temperature_log"] = np.log1p(float(input_data["temperature"]))
    data["RainFall Annual_log"] = np.log1p(float(input_data["rainfall"]))
    data["Yield_log"] = np.log1p(float(input_data["yield"]))
    data["Production_log"] = np.log1p(float(input_data["production"]))


    # Convert to DataFrame and ensure column order matches training
    df = pd.DataFrame([data])
    return df[expected_columns]  # Reorder to match training data


def predict(input_data):


    df = preprocess_input(input_data)  # Convert input to correct format
    prediction = model.predict(df)
    return np.expm1(prediction)[0]  # Reverse log transformation


if __name__ == "__main__":

    try:
        input_json = sys.stdin.read().strip() 
        input_data = json.loads(input_json)

        result = predict(input_data)
        output_json = json.dumps({"predicted_price": result})

        sys.stdout.write(output_json + "\n")  # Print ONLY JSON
        sys.stdout.flush()
       
    except Exception as e:
        sys.stdout.write(json.dumps({"error": str(e)}) + "\n")
        sys.stdout.flush()
