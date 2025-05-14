# Bunyaad Real Estate Chatbot (Gemini Version)

## Description

This project implements a Retrieval Augmented Generation (RAG) chatbot specialized for querying real estate property listings. It leverages Google's Gemini Pro for natural language understanding and generation, FAISS for efficient similarity search of property embeddings, and FastAPI to provide an API interface. The chatbot answers user questions based on information available in the `ChatbotData.xlsx` file.

## Technology Stack

* **Python**: Core programming language.
* **Google Gemini API**: Language model for generating responses. (Specifically uses `gemini-1.5-flash-latest` by default).
* **Sentence-Transformers**: For generating text embeddings (`all-MiniLM-L6-v2` model by default).
* **FAISS**: For creating and searching a vector index of property embeddings.
* **FastAPI**: For building the asynchronous API.
* **Uvicorn**: ASGI server to run the FastAPI application.
* **Pandas**: For data manipulation and reading Excel files.
* **NumPy**: For numerical operations.
* **Dotenv**: For managing environment variables.

## Prerequisites

* Python 3.8 or higher.
* A Google Cloud Project with the Gemini API enabled.
* A Google Gemini API Key.
* `pip` for installing Python packages.

## Setup and Installation

1.  **Clone the Repository (Example)**:
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Create and Activate a Virtual Environment** (Recommended):
    ```bash
    python -m venv venv
    ```
    * On Windows:
        ```bash
        .\venv\Scripts\activate
        ```
    * On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set Up Environment Variables**:
    Create a `.env` file in the root directory of the project and add your Google Gemini API key:
    ```env
    GOOGLE_API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```

5.  **Prepare Data**:
    Place your property listings data in an Excel file named `ChatbotData.xlsx` in the root directory. The expected columns are used by the `preprocess_property_row` function in `Bunyaad_Chatbot.py` (e.g., `PropertyID`, `Type`, `City`, `Area`, `Size`, `Unit`, `Bedrooms`, `Bathrooms`, `Price (PKR)`, `Status`, `Features`, `Description`, `Contact`).

## Running the Application

1.  **Start the FastAPI Server**:
    You can run the application using Uvicorn directly from the command line:
    ```bash
    uvicorn main:app --reload
    ```
    Alternatively, if `if __name__ == "__main__":` block is configured in `main.py` to run uvicorn (as in the provided code):
    ```bash
    python main.py
    ```
    The server will typically start on `http://127.0.0.1:8000` (or the port specified by the `PORT` environment variable).

2.  **Initial Data Processing**:
    On the first run, the application will process `ChatbotData.xlsx`, generate embeddings, and create a FAISS index (`bunyaad_property_index.faiss`) and a processed data file (`bunyaad_processed_data.pkl`). This might take some time depending on the size of your data. Subsequent runs will load these pre-processed files unless `force_reprocess=True` is set or the files are missing.

## API Endpoints

The API provides the following endpoints:

* **`GET /`**:
    * Description: Welcome message for the API.
    * Response: `{"message": "Welcome to the Bunyaad Chatbot API (Gemini Version). Use POST /chat to interact."}`

* **`POST /chat`**:
    * Description: Main endpoint to interact with the chatbot.
    * Request Body (JSON):
        ```json
        {
            "query": "Are there any 3 bedroom houses available in DHA?"
        }
        ```
    * Successful Response (JSON):
        ```json
        {
            "response": "Based on the provided listings, I found a 3-bedroom house in DHA..."
        }
        ```
    * Error Responses: Standard HTTP error codes (e.g., 400, 500, 503) with details in JSON format.

* **`GET /docs`**:
    * Description: Access the auto-generated FastAPI interactive API documentation (Swagger UI).

* **`GET /openapi.json`**:
    * Description: Access the OpenAPI schema for the API.

* **`GET /health`**:
    * Description: Health check endpoint providing status of resources and API key configuration.
    * Response (JSON):
        ```json
        {
            "status": "ok",
            "resources_loaded": true,
            "gemini_api_key_configured": true,
            "gemini_model_initialized": true
        }
        ```

## File Structure

## 📁 Project Structure

chatbot/ 
├── main.py # FastAPI server 
├── Bunyaad_Chatbot.py # Chatbot logic (loading, embeddings, query) 
├── .env # Environment file with OpenAI API key 
├── bunyaad_processed_data.pkl # Preprocessed data (text + metadata) 
├── bunyaad_property_index.faiss # FAISS vector index 
├── requirements.txt # Python dependencies 
└── venv/ # Python virtual environment (optional)


---


