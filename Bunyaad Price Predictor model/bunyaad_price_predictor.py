# Filename: bunyaad_price_predictor.py

import pandas as pd
import numpy as np
import re
import joblib  # For saving/loading scaler and encoders
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, MinMaxScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

# --- TensorFlow / Keras Imports (Conditional) ---
# Wrap these in try-except blocks for flexibility if the user
# only wants to run prediction without installing TensorFlow locally immediately
try:
    import tensorflow as tf
    from tensorflow.keras.models import Sequential, load_model
    from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, LeakyReLU
    from tensorflow.keras.optimizers import Adam
    from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
    TF_AVAILABLE = True
except ImportError:
    print("Warning: TensorFlow is not installed. Training functionality will be unavailable.")
    TF_AVAILABLE = False

# --- Configuration Constants ---
RAW_DATA_FILE = "cleaned_data_graana.csv" # Adjust if your initial file name is different
PROCESSED_DATA_DIR = "processed_data"
MODEL_DIR = "model_files"
MODEL_SAVE_PATH = os.path.join(MODEL_DIR, "property_price_model_v3.keras") # <--- Changed version
PREPROCESSOR_SAVE_PATH = os.path.join(MODEL_DIR, "preprocessor_objects_v3.joblib") # <--- Changed version

# Ensure directories exist
os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

# --- Preprocessing Functions ---

def convert_area(value):
    """Converts area string (Marla, Kanal, Sqft, Sqyd) to Sqft."""
    try:
        if isinstance(value, str):
            value = value.strip()
            # Improved regex to handle variations like '5 Marla' or just '5' (assume sqft if no unit)
            match = re.search(r"([\d.]+)\s*(Marla|Kanal|Sqft|Sqyd)?", value, re.IGNORECASE)
            if match:
                num = float(match.group(1))
                unit_str = match.group(2)
                unit = unit_str.lower() if unit_str else "sqft" # Default to sqft if no unit mentioned
                conversion_factors = {"marla": 225, "kanal": 4500, "sqyd": 9, "sqft": 1}
                # Get the factor, default to 1 (sqft) if unit is unknown after number
                return num * conversion_factors.get(unit, 1)
        elif isinstance(value, (int, float)):
            return float(value) # Ensure float type, assume it's already in sqft
        return np.nan # Return NaN for types it can't handle or failed parse
    except Exception:
        return np.nan

def convert_price(value):
    """Converts price string (Arab, Crore, Lakh/Lac) to numerical PKR."""
    try:
        if isinstance(value, str):
            value = value.strip().replace('PKR', '').strip() # Remove PKR and spaces
            match = re.search(r"([\d.]+)\s*(Arab|Crore|Lakh|Lac)?", value, re.IGNORECASE)
            if match:
                num = float(match.group(1))
                unit = match.group(2).lower() if match.group(2) else None
                conversion_factors = {"arab": 1_000_000_000, "crore": 10_000_000, "lakh": 100_000, "lac": 100_000}
                # Default to 1 if unit is missing or not recognized after number
                return num * conversion_factors.get(unit, 1)
        elif isinstance(value, (int, float)):
             return float(value) # Ensure float type
        return np.nan # Return NaN for types it can't handle
    except Exception:
        return np.nan

def classify_purpose(value):
    """Classifies purpose into 'Rent' or 'Sale'."""
    value = str(value).lower().strip()
    if "rent" in value:
        return "Rent"
    elif "sale" in value or "sell" in value:
        return "Sale"
    else:
        # Defaulting unknowns to 'Sale' as often 'For Sale' might be implicit
        # Adjust this based on data understanding if needed
        return "Sale"


def clean_bedrooms_bathrooms(df):
    """Cleans 'bedroom' and 'bath' columns."""
    # Use .loc to avoid SettingWithCopyWarning
    df_copy = df.copy()
    if 'bedroom' in df_copy.columns:
        df_copy['bedroom'] = df_copy['bedroom'].replace("Studio", 0) # Treat Studio as 0 bedrooms initially
        df_copy['bedroom'] = df_copy['bedroom'].replace(r"(\d+)\+", r"\1", regex=True) # Handle '10+' -> 10
        df_copy['bedroom'] = pd.to_numeric(df_copy['bedroom'], errors='coerce')
        df_copy['bedroom'] = df_copy['bedroom'].fillna(0).astype(int) # Fill AFTER coercion
    else:
         df_copy['bedroom'] = 0 # Add column if missing and fill with 0

    if 'bath' in df_copy.columns:
        df_copy['bath'] = df_copy['bath'].replace(r"(\d+)\+", r"\1", regex=True) # Handle '10+' -> 10
        df_copy['bath'] = pd.to_numeric(df_copy['bath'], errors='coerce')
        df_copy['bath'] = df_copy['bath'].fillna(0).astype(int) # Fill AFTER coercion
    else:
        df_copy['bath'] = 0 # Add column if missing and fill with 0

    return df_copy

def remove_outliers_iqr(df, column):
    """Removes outliers from a specific column using IQR."""
    # Ensure the column is numeric before calculating quantiles
    if column in df.columns and pd.api.types.is_numeric_dtype(df[column]):
        # Ignore NaNs when calculating quantiles
        Q1 = df[column].quantile(0.25, interpolation='midpoint')
        Q3 = df[column].quantile(0.75, interpolation='midpoint')
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        # Keep rows where the value is within bounds OR is NaN (imputer will handle NaNs)
        return df[((df[column] >= lower_bound) & (df[column] <= upper_bound)) | df[column].isna()].copy() # Return a copy
    else:
        print(f"Warning: Column '{column}' is not numeric or not found. Skipping outlier removal.")
        return df # Return original df if column is not numeric


def preprocess_data(df, is_training=True, preprocessor_objects=None):
    """Loads, cleans, preprocesses data, and handles features."""
    print(f"Preprocessing data... Training mode: {is_training}")

    # 1. Initial Cleaning & Conversion
    df_clean = df.copy()
    if 'index' in df_clean.columns:
      df_clean = df_clean.drop(columns=['index'], errors='ignore')
    if 'level_0' in df_clean.columns:
        df_clean = df_clean.drop(columns=['level_0'], errors='ignore')

    print("Converting area...")
    # Convert area first as it might be needed for features/filtering
    if 'area' in df_clean.columns:
        df_clean['area'] = df_clean['area'].apply(convert_area)
        # Remove rows with NaN or non-positive area early on
        df_clean = df_clean.dropna(subset=['area'])
        df_clean = df_clean[df_clean['area'] > 0].copy()
        if df_clean.empty:
             raise ValueError("DataFrame became empty after area conversion and filtering. Check 'area' data.")
    else:
         raise ValueError("'area' column not found or became empty after cleaning.")

    # Convert price only if it exists (primarily for training)
    if 'price' in df_clean.columns:
        print("Converting price...")
        df_clean['price'] = df_clean['price'].apply(convert_price)
        # Drop rows where price conversion failed (NaN) if training
        if is_training:
            df_clean = df_clean.dropna(subset=['price'])
            if df_clean.empty:
                raise ValueError("DataFrame became empty after dropping rows with invalid prices.")
    elif is_training:
        # Price column is mandatory for training
        raise ValueError("Target column 'price' not found in the training dataframe.")


    # Ensure 'purpose' column exists before classifying
    if 'purpose' in df_clean.columns:
      print("Classifying purpose...")
      df_clean['classified_purpose'] = df_clean['purpose'].apply(classify_purpose)
      # Drop original 'purpose' if needed, keep classified version
      # df_clean = df_clean.drop(columns=['purpose'])
    elif 'classified_purpose' not in df_clean.columns: # Only add if not already present
      print("Warning: 'purpose' column not found. Assuming 'Sale' for 'classified_purpose'.")
      df_clean['classified_purpose'] = 'Sale' # Defaulting if purpose column is missing


    # 2. Select Relevant Columns + Target
    # REMOVED 'price_per_sqft' from features
    relevant_feature_cols = ['area', 'bedroom', 'bath', 'location', 'type', 'location_city', 'classified_purpose']
    target_col = 'price'

    # Filter based on columns ACTUALLY PRESENT in df_clean
    available_feature_cols = [col for col in relevant_feature_cols if col in df_clean.columns]

    # Select columns - include price only if training
    cols_to_select = available_feature_cols
    if is_training and target_col in df_clean.columns:
        cols_to_select = available_feature_cols + [target_col]
    elif is_training:
         # This case should have been caught earlier, but as a safeguard
         raise ValueError("Target column 'price' missing during training selection.")

    df_selected = df_clean[cols_to_select].copy()


    # 3. Handle Missing Values (Initial Pass) & Clean Specific Columns
    print("Cleaning bedrooms and bathrooms / handling missing values...")

    # Clean bedrooms/bathrooms - this function now handles missing columns too
    df_selected = clean_bedrooms_bathrooms(df_selected)

    # Drop rows where key categorical columns are missing (critical for encoding)
    # Do this BEFORE imputation of these columns
    categorical_cols_to_check = ['location', 'location_city', 'type', 'classified_purpose']
    essential_categorical = [col for col in categorical_cols_to_check if col in df_selected.columns]
    df_selected = df_selected.dropna(subset=essential_categorical)

    if df_selected.empty:
        raise ValueError("DataFrame became empty after dropping rows with missing essential categorical features.")


    # 4. Outlier Removal (only on numerical features AND price if training)
    print("Removing outliers...")
    numerical_cols_for_outlier = ['area', 'bedroom', 'bath'] # Only features now
    df_outliers_removed = df_selected.copy()

    for col in numerical_cols_for_outlier:
      if col in df_outliers_removed.columns:
          df_outliers_removed = remove_outliers_iqr(df_outliers_removed, col)
          if df_outliers_removed.empty:
               raise ValueError(f"DataFrame became empty after removing outliers for '{col}'. Check data or IQR thresholds.")

    # Remove price outliers only during training
    if is_training and target_col in df_outliers_removed.columns:
        print(f"Removing outliers for target column '{target_col}'...")
        df_outliers_removed = remove_outliers_iqr(df_outliers_removed, target_col)
        if df_outliers_removed.empty:
            raise ValueError(f"DataFrame became empty after removing outliers for target '{target_col}'. Check data or IQR thresholds.")


    # Check if dataframe is empty after all outlier removal
    if df_outliers_removed.empty:
        raise ValueError("DataFrame became empty after outlier removal. Check your data or outlier thresholds.")

    # 5. Log Transform Target Variable (only during training)
    df_processed = df_outliers_removed.copy()
    if is_training:
        print("Log transforming target variable...")
        # Ensure price is positive before log transform
        df_processed = df_processed[df_processed[target_col] > 0].copy()
        if df_processed.empty:
             raise ValueError("DataFrame empty after filtering for positive prices before log transform.")
        df_processed[target_col] = np.log1p(df_processed[target_col])


    # 6. Define Feature Types for Transformation (based on available cols)
    # REMOVED price_per_sqft
    numerical_features_base = ['area', 'bedroom', 'bath']
    categorical_features_base = ['location', 'location_city', 'type', 'classified_purpose']

    # Filter available features based on the dataframe columns JUST BEFORE splitting X/y or processing X
    numerical_features = [col for col in numerical_features_base if col in df_processed.columns]
    categorical_features = [col for col in categorical_features_base if col in df_processed.columns]

    # --- Preprocessing Pipeline ---
    if is_training:
        print("Setting up training preprocessor...")
        # Separate features (X) and target (y)
        X = df_processed[numerical_features + categorical_features]
        y = df_processed[target_col]

        if X.empty or y.empty:
             raise ValueError("X or y DataFrame became empty before fitting preprocessor.")

        numeric_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', MinMaxScaler())
        ])
        categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
            ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ])
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, numerical_features),
                ('cat', categorical_transformer, categorical_features)
            ],
            remainder='drop' # Ensure no unexpected columns slip through
        )

        print("Fitting preprocessor and transforming training data...")
        X_processed = preprocessor.fit_transform(X)

        # Get feature names after one-hot encoding
        try:
            # For newer scikit-learn versions
            ohe_feature_names = preprocessor.named_transformers_['cat']['onehot'].get_feature_names_out(categorical_features)
        except AttributeError:
            # Fallback for older versions (might need adjustment based on exact version)
            print("Warning: Using fallback for getting OHE feature names. Ensure compatibility.")
            ohe_feature_names = []
            # Check if categories_ attribute exists before trying to access it
            if hasattr(preprocessor.named_transformers_['cat']['onehot'], 'categories_'):
                for i, feature in enumerate(categorical_features):
                    # Ensure index is within bounds
                    if i < len(preprocessor.named_transformers_['cat']['onehot'].categories_):
                        for category in preprocessor.named_transformers_['cat']['onehot'].categories_[i]:
                            ohe_feature_names.append(f"{feature}_{category}")
                    else:
                         print(f"Warning: Feature index {i} out of bounds for categories_ during OHE name generation (Training).")
            else:
                print("Warning: Could not retrieve OHE categories_ attribute.")


        all_feature_names = numerical_features + list(ohe_feature_names)

        X_processed_df = pd.DataFrame(X_processed, columns=all_feature_names, index=X.index)

        preprocessor_objects = {
            'preprocessor': preprocessor,
            'feature_names': all_feature_names,
             # Store numerical and categorical feature lists used DURING fitting
            'numerical_features': numerical_features,
            'categorical_features': categorical_features
        }
        print(f"Saving preprocessor objects to {PREPROCESSOR_SAVE_PATH}")
        joblib.dump(preprocessor_objects, PREPROCESSOR_SAVE_PATH)

        print("Preprocessing complete for training.")
        return X_processed_df, y, preprocessor_objects

    else: # For prediction
        print("Loading preprocessor objects for prediction...")
        if preprocessor_objects is None:
             if os.path.exists(PREPROCESSOR_SAVE_PATH):
                  preprocessor_objects = joblib.load(PREPROCESSOR_SAVE_PATH)
             else:
                  raise FileNotFoundError(f"Preprocessor object file not found at {PREPROCESSOR_SAVE_PATH}. Please train the model first.")

        preprocessor = preprocessor_objects['preprocessor']
        training_feature_names = preprocessor_objects['feature_names']
        # Get the feature lists used during fitting the preprocessor
        numerical_features_fit = preprocessor_objects.get('numerical_features', []) # Use saved list
        categorical_features_fit = preprocessor_objects.get('categorical_features', []) # Use saved list


        # Prepare input dataframe X for prediction
        # Ensure only columns used during fitting are present AND in the correct order
        features_for_transform = numerical_features_fit + categorical_features_fit
        missing_input_cols = set(features_for_transform) - set(df_processed.columns)
        if missing_input_cols:
            raise ValueError(f"Input data for prediction is missing required columns: {missing_input_cols}")

        X = df_processed[features_for_transform].copy() # Select only the necessary columns in the right order

        if X.empty:
             raise ValueError("Input DataFrame became empty before prediction transformation.")

        print("Transforming prediction data using loaded preprocessor...")
        X_processed = preprocessor.transform(X) # Use transform, not fit_transform

        # Create DataFrame with names derived from the *loaded* preprocessor to ensure consistency
        try:
            ohe_feature_names_processed = preprocessor.named_transformers_['cat']['onehot'].get_feature_names_out(categorical_features_fit)
        except AttributeError:
             print("Warning: Using fallback for getting OHE feature names during prediction.")
             ohe_feature_names_processed = []
             if hasattr(preprocessor.named_transformers_['cat']['onehot'], 'categories_'):
                  for i, feature in enumerate(categorical_features_fit):
                      if i < len(preprocessor.named_transformers_['cat']['onehot'].categories_):
                          for category in preprocessor.named_transformers_['cat']['onehot'].categories_[i]:
                              ohe_feature_names_processed.append(f"{feature}_{category}")
                      else:
                           print(f"Warning: Feature index {i} out of bounds for categories_ during OHE name generation (Prediction).")
             else:
                 print("Warning: Could not retrieve OHE categories_ attribute during prediction.")


        all_feature_names_processed = numerical_features_fit + list(ohe_feature_names_processed)

        # Convert processed data back to DataFrame with correct columns from the transformation
        X_processed_df = pd.DataFrame(X_processed, columns=all_feature_names_processed, index=X.index)

        # Align columns with the training feature names EXACTLY
        # training_feature_names were saved in preprocessor_objects
        missing_cols = set(training_feature_names) - set(X_processed_df.columns)
        for c in missing_cols:
            X_processed_df[c] = 0 # Add missing columns (e.g., rare category seen in training but not prediction)

        extra_cols = set(X_processed_df.columns) - set(training_feature_names)
        if extra_cols:
             print(f"Warning: Extra columns found after prediction transform: {extra_cols}. Dropping them.")
             X_processed_df = X_processed_df.drop(columns=list(extra_cols))


        # Ensure order is identical to training
        X_processed_final = X_processed_df[training_feature_names]

        print("Preprocessing complete for prediction.")
        # Target 'y' is None during prediction, return the final processed DataFrame
        return X_processed_final, None, preprocessor_objects

# --- Model Training Function ---

def build_model(input_shape):
    """Builds the Keras Sequential model."""
    if not TF_AVAILABLE:
        raise ImportError("TensorFlow is required to build the model.")

    model = Sequential([
        Dense(256, input_shape=(input_shape,)), # Correct input shape
        LeakyReLU(alpha=0.1), # Updated parameter name
        BatchNormalization(),
        Dropout(0.3),

        Dense(128),
        LeakyReLU(alpha=0.1),
        BatchNormalization(),
        Dropout(0.3),

        Dense(64),
        LeakyReLU(alpha=0.1),
        BatchNormalization(),
        Dropout(0.2),

        Dense(32),
        LeakyReLU(alpha=0.1),
        BatchNormalization(),

        Dense(1)  # Output layer
    ])
    model.compile(optimizer=Adam(learning_rate=0.001),
                  loss='mean_absolute_percentage_error', # Using MAPE
                  metrics=['mae']) # Mean Absolute Error
    return model

def train_model_pipeline():
    """Loads data, preprocesses, trains the model, and saves artifacts."""
    if not TF_AVAILABLE:
        print("Error: TensorFlow is not installed. Cannot train the model.")
        return

    print("--- Starting Model Training Pipeline ---")
    # Load raw data
    print(f"Loading raw data from {RAW_DATA_FILE}...")
    try:
        df_raw = pd.read_csv(RAW_DATA_FILE)
    except FileNotFoundError:
        print(f"Error: Raw data file not found at {RAW_DATA_FILE}")
        return
    except pd.errors.EmptyDataError:
        print(f"Error: Raw data file {RAW_DATA_FILE} is empty.")
        return
    except Exception as e:
        print(f"Error loading data: {e}")
        return


    # Preprocess data for training (this fits and saves the preprocessor)
    try:
        # Pass is_training=True
        X_processed_df, y, preprocessor_objects = preprocess_data(df_raw, is_training=True)
    except ValueError as e:
        print(f"Error during preprocessing: {e}")
        return
    except Exception as e:
        print(f"An unexpected error occurred during preprocessing: {e}")
        import traceback
        traceback.print_exc()
        return

    # Check if preprocessing returned empty dataframes
    if X_processed_df.empty or y.empty:
        print("Error: Preprocessing resulted in empty dataframes. Cannot proceed with training.")
        return


    # Split processed data
    print("Splitting data into training and testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(X_processed_df, y, test_size=0.2, random_state=42)

    # Check if splits are empty
    if X_train.empty or y_train.empty:
        print("Error: Training set is empty after splitting. Check data and preprocessing steps.")
        return


    # Build the model
    print("Building the model...")
    input_shape = X_train.shape[1] # Shape from processed data
    print(f"Model input shape: ({input_shape},)")
    model = build_model(input_shape)
    print(model.summary())

    # Define callbacks
    callbacks = [
        EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True, verbose=1), # Increased patience slightly
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=7, min_lr=1e-6, verbose=1) # Increased patience slightly
    ]

    # Train the model
    print("Starting model training...")
    history = model.fit(X_train, y_train,
                        validation_data=(X_test, y_test) if not X_test.empty else None, # Handle empty test set case
                        epochs=100, # Increased epochs, EarlyStopping will handle termination
                        batch_size=64, # Slightly larger batch size
                        callbacks=callbacks,
                        verbose=1)

    # Evaluate the model
    print("Evaluating model on test set...")
    # Ensure X_test and y_test are not empty before evaluation
    if not X_test.empty and not y_test.empty:
        test_loss, test_mae = model.evaluate(X_test, y_test, verbose=0)
        print(f"Test Loss (MAPE): {test_loss:.4f}")
        print(f"Test MAE (log-scale): {test_mae:.4f}")

        # Convert MAE back to approximate price scale for interpretation
        # Ensure y_test is not empty before calculating mean
        if not y_test.empty:
             avg_actual_price = np.expm1(y_test).mean()
             # A slightly better approximation might relate MAE on log scale to relative error
             approx_relative_error = test_mae # MAE on log is roughly average relative error
             approx_test_mae_pkr = approx_relative_error * avg_actual_price
             print(f"Approximate Test MAE in price scale: {approx_test_mae_pkr:,.2f} PKR")
        else:
             print("Cannot calculate approximate MAE in PKR: y_test is empty.")

    else:
        print("Warning: Test set is empty. Skipping evaluation.")


    # Save the trained model
    print(f"Saving trained model to {MODEL_SAVE_PATH}")
    model.save(MODEL_SAVE_PATH)

    print("--- Model Training Pipeline Finished ---")


# --- Prediction Function ---

def predict_price(input_data_dict):
    """
    Predicts the price for a single property given as a dictionary.

    Args:
        input_data_dict (dict): Dictionary containing raw property features.
                                 Example: {'area': 1125, 'bedroom': 3, 'bath': 2,
                                           'location': 'Bahria Town Phase 4',
                                           'location_city': 'Rawalpindi',
                                           'type': 'House',
                                           'classified_purpose': 'Sale'}
                                 NOTE: 'area' should be in Sqft or convertible string.

    Returns:
        float: The predicted price in PKR, or None if prediction fails.
    """
    print("--- Starting Price Prediction ---")
    if not TF_AVAILABLE:
        print("Error: TensorFlow is not installed. Cannot make predictions.")
        return None

    # --- Load Model and Preprocessor ---
    try:
        print(f"Loading model from {MODEL_SAVE_PATH}...")
        if not os.path.exists(MODEL_SAVE_PATH):
             raise FileNotFoundError(f"Model file not found at {MODEL_SAVE_PATH}. Retrain the model using --train.")
        model = load_model(MODEL_SAVE_PATH)

        print(f"Loading preprocessor objects from {PREPROCESSOR_SAVE_PATH}...")
        if not os.path.exists(PREPROCESSOR_SAVE_PATH):
             raise FileNotFoundError(f"Preprocessor object file not found at {PREPROCESSOR_SAVE_PATH}. Retrain the model using --train.")
        preprocessor_objects = joblib.load(PREPROCESSOR_SAVE_PATH)

    except Exception as e:
        print(f"Error loading model or preprocessor: {e}")
        return None

    # --- Preprocess Input Data ---
    try:
        # Add default values for optional features if missing in input dict
        # Use the feature lists saved during training to know what's expected
        expected_features = preprocessor_objects.get('numerical_features', []) + \
                            preprocessor_objects.get('categorical_features', [])
        # Provide defaults (0 for numeric, 'missing' for categorical handled by imputer)
        processed_input_dict = {}
        for feature in expected_features:
            if feature in input_data_dict:
                processed_input_dict[feature] = input_data_dict[feature]
            elif feature in ['bedroom', 'bath']: # Use 0 for missing bed/bath
                processed_input_dict[feature] = 0
            # Add other defaults if needed, otherwise let preprocess_data handle it


        input_df_raw = pd.DataFrame([processed_input_dict]) # Convert dict to DataFrame

        # Pass the raw input_df for preprocessing
        # is_training=False tells it not to expect/use 'price'
        # Pass loaded objects to use the same transformations.
        X_processed_final, _, _ = preprocess_data(input_df_raw, is_training=False, preprocessor_objects=preprocessor_objects)

        # Check if preprocessing returned an empty dataframe
        if X_processed_final.empty:
            print("Error: Preprocessing resulted in an empty DataFrame for the input data.")
            return None

        # Verify the final processed columns match the model's expected input shape
        expected_input_dim = model.input_shape[-1]
        actual_input_dim = X_processed_final.shape[1]
        if expected_input_dim != actual_input_dim:
            print(f"Error: Model expects input dimension {expected_input_dim} but preprocessed data has {actual_input_dim} features.")
            print("Expected features (based on training):", preprocessor_objects['feature_names'])
            print("Actual features after processing prediction input:", X_processed_final.columns.tolist())
            return None


    except ValueError as e:
         print(f"Error during input data preprocessing: {e}")
         return None
    except FileNotFoundError as e: # Catch missing preprocessor file here too
         print(f"Error: {e}")
         return None
    except Exception as e:
        print(f"An unexpected error occurred during preprocessing of input data: {e}")
        import traceback
        traceback.print_exc()
        return None

    # --- Make Prediction ---
    try:
        print("Making prediction...")
        log_price_pred = model.predict(X_processed_final)
        # Convert log prediction back to actual price
        # Ensure prediction is not negative before expm1
        log_pred_scalar = log_price_pred[0][0]
        predicted_price = np.expm1(log_pred_scalar) if log_pred_scalar > 0 else 0

        print(f"Predicted Price (PKR): {predicted_price:,.2f}")
        print("--- Prediction Finished ---")
        return predicted_price
    except Exception as e:
        print(f"Error during prediction: {e}")
        import traceback
        traceback.print_exc()
        return None


# --- Main Execution ---
if __name__ == "__main__":
    try:
        import argparse
        parser = argparse.ArgumentParser(description="Bunyaad Property Price Predictor")
        parser.add_argument('--train', action='store_true', help='Run the training pipeline.')
        parser.add_argument('--predict', action='store_true', help='Run a sample prediction.')
        # Add arguments for prediction inputs if needed later
        # parser.add_argument('--area', type=str, help='Area (e.g., "5 Marla", "1125")')
        # ... other features

        args = parser.parse_args()

        if args.train:
            if TF_AVAILABLE:
                 train_model_pipeline()
            else:
                 print("Cannot train: TensorFlow is not installed.")
        elif args.predict:
             # Sample Prediction 1
             print("\nRunning Sample Prediction 1:")
             sample_data_1 = {
                 'area': "5 Marla", # Use string format convertible by convert_area
                 'bedroom': 3,
                 'bath': 2,
                 'location': 'Bahria Town Phase 4', # Use a location likely seen in training
                 'location_city': 'Rawalpindi',
                 'type': 'House',
                 'classified_purpose': 'Sale'
             }
             # Ensure all keys expected by the *trained* preprocessor are present or handled
             predict_price(sample_data_1)

             # Sample Prediction 2 (Example with different area unit)
             print("\nRunning Sample Prediction 2:")
             sample_data_2 = {
                 'area': 4500, # 1 Kanal as Sqft
                 'bedroom': 5,
                 'bath': 5,
                 'location': 'DHA Phase 5', # Use a location likely seen in training
                 'location_city': 'Lahore',
                 'type': 'House',
                 'classified_purpose': 'Sale'
             }
             predict_price(sample_data_2)

        else:
             # Default action: Run a default sample prediction if no arguments are given
             print("\nNo action specified (--train or --predict). Running default sample prediction:")
             sample_data_default = {
                 'area': "10 Marla", # Approx 2250 sqft
                 'bedroom': 4,
                 'bath': 4,
                 'location': 'DHA Phase 2', # Use a location likely seen in training
                 'location_city': 'Islamabad',
                 'type': 'House',
                 'classified_purpose': 'Sale'
             }
             predict_price(sample_data_default)

    except SystemExit as e:
         # Catch the SystemExit raised by argparse on error in specific environments
         if e.code == 2: # Code 2 usually indicates an argument parsing error
              print("\nArgument parsing failed. This might be due to the execution environment.")
              print("Running default sample prediction instead...")
              sample_data_default = {
                   'area': "10 Marla", # Approx 2250 sqft
                   'bedroom': 4,
                   'bath': 4,
                   'location': 'DHA Phase 2',
                   'location_city': 'Islamabad',
                   'type': 'House',
                   'classified_purpose': 'Sale'
              }
              predict_price(sample_data_default)
         else:
              print(f"Script exited with code: {e.code}")
    except Exception as e:
         print(f"An unexpected error occurred in main execution: {e}")
         import traceback
         traceback.print_exc()

# Example Usage from command line:
# 1. To train the model (reads RAW_DATA_FILE, saves model and preprocessor):
#    python bunyaad_price_predictor.py --train
#
# 2. To run sample predictions (loads saved model and preprocessor):
#    python bunyaad_price_predictor.py --predict
#    (or just python bunyaad_price_predictor.py for the default sample)