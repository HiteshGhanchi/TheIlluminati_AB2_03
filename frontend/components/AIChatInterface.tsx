import { useState, useEffect, useRef } from "react";
import { PlusCircle, Send, Paperclip, Mic, AlertTriangle, BookOpen, Save, ArrowLeft, FileText } from "lucide-react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";

type Message = {
  id: string;
  sender: "Doctor" | "Bot";
  content: string;
  timestamp: Date; // Timestamp will now be received from the backend
};

type Case = {
  id: string;
  diagnosis: string;
  lastUpdate: Date;
  status: "ongoing" | "resolved";
};

interface AIChatInterfaceProps {
  patientId: string;
  initialCaseId: string | null;
  onClose: () => void;
}

export default function AIChatInterface({ patientId, initialCaseId, onClose }: AIChatInterfaceProps) {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<string | null>(initialCaseId);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "Bot",
      content:
        "Hello, I'm your AI assistant. How can I help you today? You can ask me about:\n\n" +
        "• Patient symptoms and possible diagnoses\n" +
        "• Treatment recommendations\n" +
        "• Drug interactions and side effects\n" +
        "• Recent medical research related to the patient's condition\n" +
        "• Interpretation of lab results\n\n" +
        "What would you like to discuss regarding this patient?",
      timestamp: new Date('2025-03-02T12:30:00Z'), // Initial timestamp, but it will be overwritten by the backend timestamp
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [summary, setSummary] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const socket = io(`http://localhost:${process.env.NEXT_PUBLIC_PORT}`, { transports: ["websocket"] });
  const handleSelectCase = async (caseId: string) => {
    setSelectedCase(caseId);
    
    try {
      // Fetch chat history for this case
      const response = await axios.get(
        `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/cases/chats/${caseId}`
      );
      
      console.log(response?.data?.chat);

      // Transform messages to match your frontend Message type
      const chatHistory = response.data?.chat.messages.map((msg: any) => ({
        id: msg._id || new Date(msg.timestamp).toISOString(), // Use message ID if available or generate one
        sender: msg.sender,
        content: msg.message, // Backend uses 'message', frontend uses 'content'
        timestamp: new Date(msg.timestamp)
      }));
      
      setMessages(chatHistory);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      // Show an empty chat or error message
      setMessages([{
        id: "error",
        sender: "Bot",
        content: "Failed to load previous messages. Please try again.",
        timestamp: new Date()
      }]);
    }
  };

  useEffect(() => {
    // Fetch cases for the patient
    const sendReq = async () => {
      try {
        const res = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/cases/${patientId}`
        );
        console.log(res);
        setCases(res.data.cases);
      } catch (e) {
        console.log(e);
      }
    };
    sendReq();

    // If there's an initial case ID, load that case
    if (initialCaseId) {
      handleSelectCase(initialCaseId);
    }
  }, [initialCaseId]);

  useEffect(() => {
    // Scroll to bottom of chat when messages update
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Updated dependency to only track the length of messages

  useEffect(() => {
    if (!selectedCase) return;

    socket.emit("joinRoom", selectedCase);

    socket.on("newMessage", (messageData) => {
      console.log("New message:", messageData);
      const formattedMessage: Message = {
        id: new Date().toISOString(), // Generate a unique ID
        sender: messageData.sender,
        content: messageData.message, // Map 'message' to 'content'
        timestamp: new Date(messageData.timestamp), 
      };
      setMessages((prev) => [...prev, formattedMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedCase]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Get doctor_id from localStorage
      const doctorId = localStorage.getItem("doctor_id");  // Ensure you store doctor_id in localStorage

      if (!doctorId) {
        console.error("❌ Doctor ID not found in localStorage");
        return;
      }
      

      // Construct the new message
      const newMessage: Message = {
        id: new Date().toISOString(),  // Generate a unique message ID based on the current timestamp
        sender: "Doctor",
        content: inputMessage,
        timestamp: new Date(),
      };

  
      // Update messages state with the new message
      setMessages((prev) => [...prev, newMessage]);

      // Emit the message along with relevant information to the backend
      socket.emit("sendMessage", {
        caseId: selectedCase,       // Pass selected case ID
        patientId: patientId,       // Pass patient ID
        sender: "Doctor",           // Sender as Doctor
        message: inputMessage,      // Message content
        doctorId: doctorId,         // Pass doctor ID
      });

      // Clear the input field after sending the message
      setInputMessage("");
    }
};

  const handleStartNewCase = () => {
    const newCaseId = `C${(cases.length + 1).toString().padStart(3, "0")}`;
    const newCase: Case = {
      id: newCaseId,
      diagnosis: "New Case",
      lastUpdate: new Date('2025-03-02T12:30:00Z'),
      status: "ongoing",
    };
    setCases((prev) => [...prev, newCase]);
    setSelectedCase(newCaseId);
    setMessages([
      {
        id: "new-case",
        sender: "Bot",
        content: "A new case has been started. What symptoms or concerns would you like to discuss for this patient?",
        timestamp: new Date('2025-03-02T12:30:00Z'), // Initial timestamp
      },
    ]);
  };

 

  const handleSummarize = () => {
    // In a real application, you would send the chat history to your AI service
    // and receive a summary in response. Here, we'll simulate that with a timeout.
    setTimeout(() => {
      setSummary(
        "Summary of the conversation:\n\n" +
          "The patient reported persistent headaches and dizziness. " +
          "Based on these symptoms, hypertension was suggested as a possible cause. " +
          "Recommendations include checking the patient's blood pressure and reviewing their medical history for risk factors. " +
          "Further discussion of treatment guidelines was offered.",
      );
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Case History & Navigation */}
      <div className="w-64 bg-white p-4">
        <Button onClick={handleStartNewCase} className="w-full mb-4">
          <PlusCircle className="mr-2 h-4 w-4" /> Start New Case
        </Button>
        <Input type="search" placeholder="Search cases..." className="mb-4" />
        <ScrollArea className="h-[calc(100vh-120px)]">
          {cases.map((caseItem) => (
            <Card
              key={caseItem._id}
              className={`mb-2 cursor-pointer ${selectedCase === caseItem._id ? "border-primary" : ""}`}
              onClick={() => handleSelectCase(caseItem._id)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">
                  {caseItem._id}
                </CardTitle>
                <p className="text-xs text-gray-500">{caseItem?.created_at.split("T")[0]}</p>
                <Badge variant={caseItem.status === "ongoing" ? "default" : "secondary"}>{caseItem.status}</Badge>
              </CardHeader>
            </Card>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patient Profile
          </Button>
          <h2 className="text-xl font-semibold">AI Chat Assistant</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleSummarize}>
                <FileText className="mr-2 h-4 w-4" /> Summarize
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chat Summary</DialogTitle>
              </DialogHeader>
              <div className="mt-4 whitespace-pre-wrap">{summary}</div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "Doctor" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`max-w-3/4 p-3 rounded-lg whitespace-pre-wrap ${
                  message.sender === "Doctor" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`} 
              >
                {message.content}
                <div className="text-xs text-gray-500 mt-2">{new Date(message.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t flex items-center">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 mr-2"
          />
          <Button onClick={handleSendMessage} variant="primary">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
