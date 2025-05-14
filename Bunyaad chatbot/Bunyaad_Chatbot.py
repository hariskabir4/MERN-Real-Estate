# chatbot_logic.py

import pandas as pd
import numpy as np
import faiss
import pickle
import os
import math # math is imported but not used directly, can be removed if not needed elsewhere
from sentence_transformers import SentenceTransformer
import google.generativeai as genai # Changed from openai
from dotenv import load_dotenv
import sys # For potentially exiting on fatal errors during loading
# from google.api_core import exceptions as google_exceptions # For specific Google API error handling

# --- Configuration ---
# Ensure these paths are relative to where the script/API server is run
excel_file_path = 'ChatbotData.xlsx'
faiss_index_path = "bunyaad_property_index.faiss"
processed_data_path = "bunyaad_processed_data.pkl"
embedding_model_name = 'all-MiniLM-L6-v2'
llm_model_name = "gemini-1.5-flash-latest" # Changed to a Gemini model
k_retrieved_results = 5 # Number of results to retrieve for context

# --- Load Environment Variables ---
# Load variables from the .env file into the environment
load_dotenv()
print("Chatbot Logic: Attempting to load environment variables from .env file.")

# --- Helper Function for Preprocessing ---
def preprocess_property_row(row):
    """Processes a single row from the DataFrame into text and metadata."""
    prop_id = row.get('PropertyID', 'Unknown ID')
    prop_type = row.get('Type', 'N/A')
    city = row.get('City', 'N/A')
    location_area = row.get('Area', 'N/A')
    size_val = row.get('Size', '')
    unit = row.get('Unit', '')
    bedrooms = row.get('Bedrooms', 'N/A')
    bathrooms = row.get('Bathrooms', 'N/A')
    price_pkr = row.get('Price (PKR)', 'N/A')
    status = row.get('Status', 'N/A')
    features = row.get('Features', 'Not specified')
    description = row.get('Description', 'No description provided')
    contact = row.get('Contact', 'N/A')

    # Combine Size and Unit carefully
    size_str = f"{size_val} {unit}".strip() if size_val and unit and not pd.isna(size_val) and not pd.isna(unit) else "Size not specified"
    if size_str == "Size not specified" and pd.notna(size_val): # Handle case where only size is given
        size_str = str(size_val)

    # Format numeric fields carefully, handling potential non-numeric values or NaNs
    try:
        bedrooms_str = str(int(bedrooms)) if pd.notna(bedrooms) and isinstance(bedrooms, (int, float)) and float(bedrooms).is_integer() else str(bedrooms)
    except (ValueError, TypeError): bedrooms_str = str(bedrooms)
    try:
        bathrooms_str = str(int(bathrooms)) if pd.notna(bathrooms) and isinstance(bathrooms, (int, float)) and float(bathrooms).is_integer() else str(bathrooms)
    except (ValueError, TypeError): bathrooms_str = str(bathrooms)
    try:
        # Format price with commas if it's a valid number, otherwise keep as string
        price_pkr_cleaned = ''.join(filter(str.isdigit, str(price_pkr))) # Attempt to clean price
        if price_pkr_cleaned:
            price_str = f"{int(price_pkr_cleaned):,}"
        elif pd.notna(price_pkr):
            price_str = str(price_pkr) # Keep original string if cleaning fails but not NaN
        else:
            price_str = 'N/A' # Fallback if NaN
    except (ValueError, TypeError): price_str = str(price_pkr) # Keep as string if formatting fails

    # Handle potential NaN or 'N/A' string values more robustly
    prop_type = "Property" if pd.isna(prop_type) or str(prop_type).strip() == 'N/A' else str(prop_type).strip()
    city = "Unknown City" if pd.isna(city) or str(city).strip() == 'N/A' else str(city).strip()
    location_area = "Unknown Location" if pd.isna(location_area) or str(location_area).strip() == 'N/A' else str(location_area).strip()
    bedrooms_str = "N/A" if pd.isna(bedrooms) or str(bedrooms_str).lower() == 'nan' or str(bedrooms_str).strip() == 'N/A' else str(bedrooms_str).strip()
    bathrooms_str = "N/A" if pd.isna(bathrooms) or str(bathrooms_str).lower() == 'nan' or str(bathrooms_str).strip() == 'N/A' else str(bathrooms_str).strip()
    price_str = "Price not specified" if pd.isna(price_pkr) or str(price_str).strip() == 'N/A' or str(price_str).lower() == 'nan' else str(price_str).strip()
    status = "Status not specified" if pd.isna(status) or str(status).strip() == 'N/A' else str(status).strip()
    features = "Not specified" if pd.isna(features) or str(features).strip() == 'N/A' else str(features).strip()
    description = "No description provided" if pd.isna(description) or str(description).strip() == 'N/A' else str(description).strip()
    contact = "Contact not available" if pd.isna(contact) or str(contact).strip() == 'N/A' else str(contact).strip()

    # Construct the text string for embedding
    text_parts = [
        f"Property ID: {prop_id}.",
        f"Type: {prop_type}.",
        f"Location: {location_area}, {city}.",
        f"Size: {size_str}.",
        f"Bedrooms: {bedrooms_str}.",
        f"Bathrooms: {bathrooms_str}.",
        f"Status: {status}.",
        f"Price: {price_str} PKR.",
        f"Features: {features}.",
        f"Description: {description}.",
        f"Contact: {contact}."
    ]
    text = ' '.join(filter(None, text_parts)) # Join non-empty parts
    text = ' '.join(text.split()) # Normalize whitespace

    # Metadata for potential filtering later (not used in current RAG prompt)
    metadata = {
        'property_id': prop_id,
        'city': city,
        'type': prop_type,
        'status': status,
        'bedrooms': bedrooms_str,
        'price': price_str, # Store the formatted price string
        'location_area': location_area
    }
    return text, metadata

# --- Core Functions ---

def preprocess_and_embed(file_path):
    """Loads data from Excel, preprocesses text, generates embeddings."""
    print("Starting preprocessing and embedding...")
    output_list_of_texts = []
    output_list_of_metadata = []

    # Load and process data
    try:
        df = pd.read_excel(file_path, header=0, dtype=str).fillna('N/A')
        print(f"Loaded {len(df)} rows from {file_path}.")

        for index, row in df.iterrows():
            row_dict = row.to_dict()
            processed_text, processed_metadata = preprocess_property_row(row_dict)
            output_list_of_texts.append(processed_text)
            output_list_of_metadata.append(processed_metadata)
        print(f"Preprocessing complete. Generated {len(output_list_of_texts)} text entries.")
        if not output_list_of_texts:
            print("Warning: No text entries were generated after preprocessing.")
            return None, None, None

    except FileNotFoundError:
        print(f"FATAL Error: Data file '{file_path}' not found in directory {os.getcwd()}.")
        return None, None, None
    except Exception as e:
        print(f"Error during data loading or preprocessing: {e}")
        import traceback
        traceback.print_exc()
        return None, None, None

    # Generate embeddings
    try:
        print(f"Loading embedding model '{embedding_model_name}'...")
        embedding_model = SentenceTransformer(embedding_model_name)
        print("Generating embeddings (this may take some time)...")
        embeddings = embedding_model.encode(output_list_of_texts, show_progress_bar=True, batch_size=32)
        print(f"Embeddings generated successfully. Shape: {embeddings.shape}")
        return output_list_of_texts, output_list_of_metadata, embeddings.astype(np.float32)
    except Exception as e:
        print(f"Error during embedding generation: {e}")
        import traceback
        traceback.print_exc()
        return None, None, None


def load_resources(force_reprocess=False):
    """
    Loads or creates all necessary resources: FAISS index, text/metadata lists,
    embedding model, and configures Google Gemini API key.
    Returns a dictionary containing resources or None on critical failure.
    """
    faiss_index = None
    texts = None
    metadata = None
    embedding_model_instance = None # Renamed to avoid conflict with module
    gemini_key_present = False # Flag to check if key was loaded
    gemini_model_instance = None # To store the initialized Gemini model

    print("-" * 20)
    print("Attempting to load resources...")
    # --- Load/Create FAISS Index and Processed Data ---
    if os.path.exists(faiss_index_path) and os.path.exists(processed_data_path) and not force_reprocess:
        print(f"Found existing index ({faiss_index_path}) and data ({processed_data_path}). Loading...")
        try:
            faiss_index = faiss.read_index(faiss_index_path)
            with open(processed_data_path, 'rb') as f:
                data = pickle.load(f)
            texts = data.get('texts')
            metadata = data.get('metadata')
            if texts is None or metadata is None:
                print("Warning: Loaded data file is missing 'texts' or 'metadata'. Reprocessing.")
                faiss_index, texts, metadata = None, None, None # Force reprocess
            else:
                print(f"Loaded index with {faiss_index.ntotal} vectors.")
                print(f"Loaded {len(texts)} text entries and {len(metadata)} metadata entries.")
        except Exception as e:
            print(f"Error loading saved files: {e}. Reprocessing data...")
            faiss_index, texts, metadata = None, None, None # Reset on error

    # --- Generate resources if not loaded ---
    if faiss_index is None or texts is None or metadata is None:
        if force_reprocess:
            print("Force reprocessing enabled.")
        else:
            print("Existing resources not found or failed to load. Generating from scratch...")

        texts, metadata, embeddings = preprocess_and_embed(excel_file_path)

        if texts is not None and metadata is not None and embeddings is not None and len(texts) > 0:
            try:
                d = embeddings.shape[1]
                print(f"Creating FAISS index (Dimension: {d})...")
                faiss_index = faiss.IndexFlatL2(d)
                faiss_index.add(embeddings)
                print(f"FAISS index created successfully with {faiss_index.ntotal} vectors.")

                print(f"Saving FAISS index to {faiss_index_path}...")
                faiss.write_index(faiss_index, faiss_index_path)
                print(f"Saving processed data to {processed_data_path}...")
                with open(processed_data_path, 'wb') as f:
                    pickle.dump({'texts': texts, 'metadata': metadata}, f)
                print("Resources saved successfully.")
            except Exception as e:
                print(f"FATAL Error creating/saving FAISS index or processed data: {e}")
                import traceback
                traceback.print_exc()
                return None
        else:
            print("FATAL Error: Preprocessing or embedding failed. Cannot generate resources.")
            return None

    # --- Load Embedding Model ---
    print(f"Loading embedding model '{embedding_model_name}' for querying...")
    try:
        embedding_model_instance = SentenceTransformer(embedding_model_name)
        print("Embedding model loaded successfully.")
    except Exception as e:
        print(f"FATAL Error loading embedding model: {e}")
        import traceback
        traceback.print_exc()
        return None

    # --- Configure Google Gemini ---
    print("Configuring Google Gemini client...")
    try:
        google_api_key = os.getenv('GOOGLE_API_KEY')
        if not google_api_key:
            print("!!! WARNING: GOOGLE_API_KEY not found in environment variables.")
            print("   Please ensure it is set in your .env file or system environment.")
            print("   Gemini related functionality will fail.")
            gemini_key_present = False
        else:
            genai.configure(api_key=google_api_key)
            # Initialize the Gemini model here
            gemini_model_instance = genai.GenerativeModel(llm_model_name)
            print(f"Google Gemini API key retrieved and model '{llm_model_name}' initialized.")
            gemini_key_present = True
    except Exception as e: # Catches errors from genai.configure or GenerativeModel
        print(f"Error configuring Google Gemini client or initializing model: {e}")
        import traceback
        traceback.print_exc()
        gemini_key_present = False
        gemini_model_instance = None


    print("-" * 20)
    if faiss_index is None or texts is None or metadata is None or embedding_model_instance is None:
        print("Error: Failed to load one or more essential non-LLM resources (Index, Data, Embedding Model).")
        return None

    resources = {
        "index": faiss_index,
        "texts": texts,
        "metadata": metadata,
        "embedding_model": embedding_model_instance, # Use the instance here
        "gemini_key_present": gemini_key_present,
        "gemini_model": gemini_model_instance # Store the initialized model instance
    }
    print("Resource loading process completed.")
    return resources


def get_rag_response(query, resources, k=k_retrieved_results):
    """
    Performs RAG pipeline: embeds query, retrieves context using FAISS,
    constructs a prompt, and generates a response using Google Gemini LLM.
    """

    if not resources:
        print("Error in get_rag_response: Resources dictionary is missing.")
        return "Error: Chatbot resources not available."

    gemini_model = resources.get("gemini_model") # Retrieve the initialized model
    if not resources.get("gemini_key_present") or not gemini_model:
        print("Error in get_rag_response: Google Gemini API key not configured or model not initialized.")
        return "Error: AI service (Gemini) not configured correctly on the server."

    index = resources.get("index")
    embedding_model = resources.get("embedding_model") # This is the SentenceTransformer model
    texts = resources.get("texts")

    if not index or not embedding_model or not texts:
        print("Error in get_rag_response: Essential resource component missing (index, embedding_model, or texts).")
        return "Error: Internal configuration problem with chatbot resources."

    # 1. Embed Query
    try:
        query_embedding = embedding_model.encode([query], normalize_embeddings=False)
        if query_embedding.dtype != np.float32:
            query_embedding = query_embedding.astype(np.float32)
        if query_embedding.ndim == 1:
            query_embedding = np.expand_dims(query_embedding, axis=0)
    except Exception as e:
        print(f"Error embedding query: {e}")
        return f"Error processing your query internally (embedding stage)."

    # 2. Retrieve Context using FAISS Search
    try:
        actual_k = min(k, index.ntotal)
        retrieved_texts = []
        if actual_k > 0:
            distances, indices = index.search(query_embedding, actual_k)
            retrieved_texts = [texts[idx] for idx in indices[0] if idx != -1 and 0 <= idx < len(texts)]
    except Exception as e:
        print(f"Error searching FAISS index: {e}")
        import traceback
        traceback.print_exc()
        return f"Error retrieving relevant information internally (search stage)."

    # 3. Construct Prompt
    context_string = ""
    if retrieved_texts:
        context_string += "Context from property listings:\n---\n"
        for i, text_item in enumerate(retrieved_texts):
            context_string += f"Listing {i+1}:\n{text_item}\n---\n"
        context_string += "End of Context.\n"
    else:
        context_string = "No specific property listings matching the query were found in the available data.\n"

    # Define the prompt for the LLM
    # System instructions are part of the main prompt string for Gemini.
    prompt = f"""
You are Bunyaad AI, a specialized real estate assistant for Bunyaad Real Estate Application.
Your goal is to answer user queries about property listings based *exclusively* on the provided context below.
Do not use any external knowledge, assumptions, or information beyond the context given.
If the context does not contain the answer, clearly state that the information is not available in the provided listings.
Be concise, factual, and helpful.

User Query: "{query}"

{context_string}
Based *only* on the context provided above, answer the user's query.
Summarize the relevant properties found. If multiple properties match, list key details (like Property ID, Type, Location, Bedrooms, Price, Status, Contact if available) for each relevant one mentioned in the context.
If no relevant properties are found in the context, explicitly state something like: "Based on the provided listings, I could not find properties matching your specific request."
Do not apologize if information isn't found, just state it factually.
"""

    # 4. Call Google Gemini API
    try:
        generation_config = genai.types.GenerationConfig(
            temperature=0.1,
            max_output_tokens=500 # Corresponds to max_tokens in OpenAI
        )
        
        # Optional: Define safety settings if you need to adjust defaults
        # safety_settings = [
        #     {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        #     {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        #     {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        #     {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        # ]

        response = gemini_model.generate_content(
            prompt,
            generation_config=generation_config,
            # safety_settings=safety_settings # Uncomment to apply custom safety settings
        )
        
        # Try to access text, handle potential issues like blocked responses
        if response.parts:
            final_answer = "".join(part.text for part in response.parts).strip()
        elif response.candidates and response.candidates[0].content.parts: # Newer SDK structure
             final_answer = "".join(part.text for part in response.candidates[0].content.parts).strip()
        else: # If prompt was blocked or no content
            final_answer = "Error: The AI service did not return a valid response. This might be due to content filters or other issues."
            # You can inspect response.prompt_feedback for block reasons
            if response.prompt_feedback and response.prompt_feedback.block_reason:
                print(f"Gemini API Error: Prompt blocked due to {response.prompt_feedback.block_reason.name}")
                final_answer = f"Error: Your request was blocked by the AI service due to: {response.prompt_feedback.block_reason.name}. Please rephrase your query."
            elif response.candidates and response.candidates[0].finish_reason.name != 'STOP':
                 print(f"Gemini API Error: Generation stopped due to {response.candidates[0].finish_reason.name}")
                 final_answer = f"Error: The AI response generation was stopped due to {response.candidates[0].finish_reason.name}."


        return final_answer

    # Handle specific Google API exceptions if you've imported google_exceptions
    # except google_exceptions.PermissionDenied as e:
    #     print(f"Google Gemini Permission Denied Error: {e}")
    #     return "Error: Could not authenticate with the AI service (Gemini). Please check the server configuration (API key)."
    # except google_exceptions.ResourceExhausted as e:
    #     print(f"Google Gemini Rate Limit Error: {e}")
    #     return "Error: The AI service (Gemini) is currently busy due to high demand. Please try again shortly."
    except Exception as e: # General catch-all for other genai or google.api_core errors
        print(f"Error calling Google Gemini API: {e}")
        import traceback
        traceback.print_exc()
        return f"Error generating response from AI service (Gemini)."

# --- Example Usage (for testing directly) ---
if __name__ == "__main__":
    print("Directly running chatbot_logic.py for testing resource loading.")
    # Test loading resources (can force reprocess if needed)
    # To force reprocess: loaded_resources = load_resources(force_reprocess=True)
    loaded_resources = load_resources()

    if loaded_resources:
        print("Resources loaded successfully for testing.")
        print(f"Gemini Key Present: {loaded_resources.get('gemini_key_present')}")
        print(f"Gemini Model Instance: {'Loaded' if loaded_resources.get('gemini_model') else 'Not Loaded'}")

        if loaded_resources.get("gemini_key_present") and loaded_resources.get("gemini_model"):
            test_query = "Are there any 3 bedroom houses available in DHA?"
            print(f"\nTesting query: '{test_query}'")
            response = get_rag_response(test_query, loaded_resources)
            print("\nChatbot Response:")
            print(response)

            test_query_2 = "Tell me about property with ID 10"
            print(f"\nTesting query: '{test_query_2}'")
            response_2 = get_rag_response(test_query_2, loaded_resources)
            print("\nChatbot Response:")
            print(response_2)

            test_query_3 = "What's the weather like?" # Example of an out-of-scope query
            print(f"\nTesting query: '{test_query_3}'")
            response_3 = get_rag_response(test_query_3, loaded_resources)
            print("\nChatbot Response:")
            print(response_3)
        else:
            print("\nCannot run test query as Gemini key is not present or model failed to load.")
    else:
        print("Failed to load resources. Cannot run tests.")