from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_groq import ChatGroq
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_retrieval_chain, create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import HumanMessage, AIMessage
from langchain.document_loaders import DirectoryLoader
from langchain_community.vectorstores import FAISS


import warnings

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

app = FastAPI(title="Medical API", description="API for giving medical help", version="1.0")

# Define persistent directory for FAISSDB
FAISS_DB_PATH = "FaissDB_final"

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





# Initialize the model
model = ChatGroq(
    groq_api_key=groq_api_key,
    model_name="llama-3.3-70b-versatile",
    max_tokens=355,
    temperature =1
  
)

# System prompt for DebateAI
system_prompt = (
    "You are an **advanced AI-powered medical decision support system** designed by The Illuminati to assist doctors in diagnosing diseases, recommending treatments, and analyzing patient data. \n\n"

    "### **Core Principles:**\n"
    "- **Evidence-Based Guidance:** Provide responses aligned with the latest clinical guidelines.\n"
    "- **Accuracy & Transparency:** If uncertain, state so and suggest consulting a specialist.\n"
    "- **Urgency Prioritization:** Highlight critical conditions requiring immediate medical attention.\n\n"

    "### **Diagnostic Approach:**\n"
    "1. **Gather Patient Information:**\n"
    "   - Ask for relevant details ONE BY ONE ONLY.(e.g., symptoms, duration, onset, severity, medical history).\n"
    "   - Consider risk factors (e.g., age, lifestyle, comorbidities, medication use).\n\n"
    
    "2. **Differential Diagnosis with Probabilities:**\n"
    "   - List **likely conditions ranked by probability** (e.g., *80% Systemic Lupus Erythematosus, 60% Rheumatoid Arthritis*).\n"
    "   - Indicate **common vs. rare causes** to refine clinical reasoning.\n\n"

    "3. **Diagnostic Testing & Imaging:**\n"
    "   - Recommend **appropriate lab tests and imaging** to confirm suspected conditions.\n"
    "   - Prioritize **cost-effective and minimally invasive options first**, if applicable.\n\n"

    "### **Treatment Recommendations:**\n"
    "- Base all suggestions on **clinical guidelines** (e.g., **American College of Rheumatology (ACR), WHO, NICE**).\n"
    "- Consider **disease severity** when recommending treatments (e.g., **NSAIDs for mild cases, immunosuppressants for severe cases**).\n"
    "- Mention **potential side effects, contraindications, and drug interactions.**\n\n"

    "### **Critical Alerts:**\n"
    "🚨 **Red Flag Symptoms:** If symptoms suggest a **life-threatening condition** (e.g., heart attack, stroke, sepsis, anaphylaxis), **immediately flag it** and recommend **emergency intervention**.\n\n"

    "### **Citations & Research References:**\n"
    "- When citing research, include:\n"
    "  - Study title\n"
    "  - Authors\n"
    "  - Year of publication\n"
    "  - Key findings relevant to the query\n"
    "  - In-text citation (e.g., **[Smith et al., 2022]**)\n"
    "- Clearly state **if research is inconclusive** or if more studies are needed.\n\n"

    "Use the **context below** if any similar symptoms or diseases are found and provide **citations from research papers** at the end of your response. \n\n"

    "📂 **Contextual Data:**\n"
    "{context}"
)



# Chat prompt for question answering
qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("system","If you are asking questions please ask it one by one and not at once for information retrieval"),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

# Retriever prompt for history-aware retrieval
retriever_prompt = (
    "Given a chat history and the latest user question which might reference context in the chat history, "
    "formulate a standalone question which can be understood without the chat history. "
    "Do NOT answer the question, just reformulate it if needed and otherwise return it as is."
)
contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", retriever_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}")
        
       
    ]
)

# Setup RAG chain with history
history_aware_retriever = create_history_aware_retriever(model, retriever, contextualize_q_prompt)
question_answer_chain = create_stuff_documents_chain(model, qa_prompt)
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

# In-memory store for chat histories
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

# Conversational RAG chain with history
conversational_rag_chain = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer",
)

# Pydantic model for request body
class ChatRequest(BaseModel):
    input: str
    session_id: str = "default"

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to DebateAI API. Use /chat to start debating!"}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = conversational_rag_chain.invoke(
            {"input": request.input},
            config={"configurable": {"session_id": request.session_id}}
        )
        return {"answer": response["answer"], "session_id": request.session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/history/{session_id}")
async def get_history(session_id: str):
    if session_id not in store:
        return {"session_id": session_id, "history": []}
    history = [
        {"role": "AI" if isinstance(msg, AIMessage) else "User", "content": msg.content}
        for msg in store[session_id].messages
    ]
    return {"session_id": session_id, "history": history}

@app.get("/summary/{session_id}")
async def get_summary(session_id: str):
    session_id = session_id.strip()
    if session_id not in store or not store[session_id].messages:
        return {"session_id": session_id, "summary": "No summary available."}
    messages = store[session_id].messages
    chat_history = "\n".join([msg.content for msg in messages])
    summary_response = conversational_rag_chain.invoke(
        {"input": f"Summarize the following conversation:\n{chat_history}"},
        config={"configurable": {"session_id": session_id}}
    )
    summary = summary_response["answer"]
    return {"session_id": session_id, "summary": summary}




# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=9000)