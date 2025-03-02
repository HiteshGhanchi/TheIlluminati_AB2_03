from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import warnings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.document_loaders import DirectoryLoader
from langchain_community.vectorstores import FAISS

# Suppress warnings
warnings.filterwarnings('ignore')

# Load environment variables
load_dotenv()
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_PROJECT"] = "RAG_With_Memory"
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
groq_api_key = os.getenv("GROQ_API_KEY")

# Initialize FastAPI app
app = FastAPI(title="Medical API", description="API for giving medical help", version="1.0")

# Define persistent directory for FAISSDB
FAISS_DB_PATH = "FaissDB"

# Create embeddings model
gemini_embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Load existing vector database if available
if os.path.isdir(FAISS_DB_PATH) and os.listdir(FAISS_DB_PATH):
    print("Loading existing vector database...")
    vectorstore = FAISS.load_local(FAISS_DB_PATH, gemini_embeddings,allow_dangerous_deserialization=True )
else:
    print("No existing vector database found. Processing documents...")
    directory_path = "Datasets"

    # Load all PDFs from the directory
    loader = DirectoryLoader(directory_path, glob="**/*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()

    # Split the documents
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(documents)

    # Create vector database and persist it
    vectorstore = FAISS.from_documents(documents=splits, embedding=gemini_embeddings)
    vectorstore.save_local(FAISS_DB_PATH)

# Create retriever
retriever = vectorstore.as_retriever(search_kwargs={"score_threshold": 0.89,"include_metadata": True})

