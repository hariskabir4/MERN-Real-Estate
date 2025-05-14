import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from contextlib import asynccontextmanager

# Import your logic
# Ensure Bunyaad_Chatbot.py is in the same directory or accessible in PYTHONPATH
from Bunyaad_Chatbot import load_resources, get_rag_response, k_retrieved_results

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str

# --- Lifespan Context Manager ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("FastAPI startup: Loading resources...")
    # Assuming load_resources is updated to return a dict with 'gemini_key_present'
    # and 'gemini_model' among other things.
    resources = load_resources(force_reprocess=False)
    if resources is None:
        print("FATAL: Failed to load resources during startup.")
        app.state.resources = None
        app.state.resources_loaded = False
    else:
        app.state.resources = resources
        app.state.resources_loaded = True
        print("FastAPI startup: Resources loaded successfully.")
        # Updated to check for gemini_key_present
        if not resources.get("gemini_key_present"):
            print("WARNING: Gemini API key (GOOGLE_API_KEY) was not found or configured in .env file.")
        if not resources.get("gemini_model"):
            print("WARNING: Gemini model failed to initialize. Chat functionality will be affected.")
    yield
    print("FastAPI shutdown: Cleanup if needed.") # Optional

# --- FastAPI App ---
app = FastAPI(
    title="Bunyaad Chatbot API (Gemini Version)",
    description="API endpoint for the Bunyaad Real Estate RAG chatbot, powered by Google Gemini.",
    version="1.1.0", # Updated version
    lifespan=lifespan
)

# --- CORS ---
origins = ["*"]  # For development. Be specific in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Root Route ---
@app.get("/")
async def root():
    return {"message": "Welcome to the Bunyaad Chatbot API (Gemini Version). Use POST /chat to interact."}

# --- Chatbot Endpoint ---
@app.post("/chat", response_model=ChatResponse)
async def handle_chat_query(request: ChatRequest, app_request: Request):
    resources = app_request.app.state.resources
    resources_loaded = getattr(app_request.app.state, 'resources_loaded', False)

    if not resources_loaded or resources is None:
        raise HTTPException(status_code=503, detail="Resources not loaded. The chatbot is not ready. Please try again later.")
    
    # Updated to check for gemini_key_present and the initialized model
    if not resources.get("gemini_key_present"):
        raise HTTPException(status_code=500, detail="Gemini API key (GOOGLE_API_KEY) not configured on the server.")
    if not resources.get("gemini_model"):
        raise HTTPException(status_code=500, detail="Gemini model not initialized on the server.")

    if not request.query or not request.query.strip(): # Also check if query is just whitespace
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    print(f"Received query: {request.query}")
    try:
        # get_rag_response should now be the Gemini-compatible version
        bot_response = get_rag_response(request.query, resources, k=k_retrieved_results)
        print(f"Generated response (first 100 chars): {bot_response[:100]}...")
        return ChatResponse(response=bot_response)
    except Exception as e:
        # Log the full error server-side for debugging
        print(f"Error processing chat query: {e}")
        import traceback
        traceback.print_exc()
        # Provide a generic error message to the client
        raise HTTPException(status_code=500, detail=f"An internal error occurred while processing your request.")

# --- Health Check ---
@app.get("/health")
async def health_check(app_request: Request):
    resources_loaded = getattr(app_request.app.state, 'resources_loaded', False)
    gemini_configured = False
    gemini_model_initialized = False

    if resources_loaded and app_request.app.state.resources:
        gemini_configured = app_request.app.state.resources.get("gemini_key_present", False)
        gemini_model_initialized = True if app_request.app.state.resources.get("gemini_model") else False

    status_details = {
        "status": "ok",
        "resources_loaded": resources_loaded,
        "gemini_api_key_configured": gemini_configured,
        "gemini_model_initialized": gemini_model_initialized
    }

    if not resources_loaded:
        status_details["detail"] = "Core resources (FAISS, data, embedding model) failed to load."
        return status_details
    if not gemini_configured:
        status_details["detail"] = "Gemini API key (GOOGLE_API_KEY) not found or configured."
    elif not gemini_model_initialized:
        status_details["detail"] = "Gemini model failed to initialize."
        
    return status_details

# --- Run Server ---
if __name__ == "__main__":
    print("Starting Uvicorn server for Bunyaad Chatbot (Gemini Version)...")
    # Default to port 6000 if PORT environment variable is not set
    port = int(os.environ.get("PORT", 6000))
    # Use "main:app" if your file is named main.py
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)