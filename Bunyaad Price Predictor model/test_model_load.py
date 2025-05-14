import tensorflow as tf
import os

# Print TensorFlow version
print(f"TensorFlow version: {tf.__version__}")

# Try loading the model with different approaches
model_path = "model_files/property_price_model_v3.keras"

print("\nAttempting to load model...")
try:
    # Try loading with custom_objects
    model = tf.keras.models.load_model(model_path, compile=False)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {str(e)}")

print("\nModel summary:")
try:
    model.summary()
except Exception as e:
    print(f"Error getting model summary: {str(e)}") 