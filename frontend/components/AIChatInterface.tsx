"use client"

import { useState, useEffect, useRef } from "react"
import { PlusCircle, Send, Paperclip, Mic, AlertTriangle, BookOpen, Save, ArrowLeft, FileText } from "lucide-react"

import { io } from "socket.io-client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Message = {
  id: string
  sender: "doctor" | "ai"
  content: string
  timestamp: Date
}

type Case = {
  id: string
  diagnosis: string
  lastUpdate: Date
  status: "ongoing" | "resolved"
}

interface AIChatInterfaceProps {
  patientId: string
  initialCaseId: string | null
  onClose: () => void
}

export default function AIChatInterface({ patientId, initialCaseId, onClose }: AIChatInterfaceProps) {
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCase, setSelectedCase] = useState<string | null>(initialCaseId)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      content:
        "Hello, I'm your AI assistant. How can I help you today? You can ask me about:\n\n" +
        "• Patient symptoms and possible diagnoses\n" +
        "• Treatment recommendations\n" +
        "• Drug interactions and side effects\n" +
        "• Recent medical research related to the patient's condition\n" +
        "• Interpretation of lab results\n\n" +
        "What would you like to discuss regarding this patient?",
      timestamp: new Date(),
    },
  ])
  console.log(`localhost:${process.env.NEXT_PUBLIC_PORT}`)
  const socket = io(`localhost:${process.env.NEXT_PUBLIC_PORT}`);

  function connectSocket() {
    socket.on("connection", (socket) => {
      console.log(socket);
    });
  }

  useEffect(() => {
    connectSocket();
  }, []);

  // useEffect(, [cas])

  const [inputMessage, setInputMessage] = useState("")
  const [summary, setSummary] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch cases for the patient
    const mockCases: Case[] = [
      { id: "C001", diagnosis: "Hypertension", lastUpdate: new Date(), status: "ongoing" },
      { id: "C002", diagnosis: "Diabetes Type 2", lastUpdate: new Date(Date.now() - 86400000), status: "resolved" },
    ]
    setCases(mockCases)

    // If there's an initial case ID, load that case
    if (initialCaseId) {
      handleSelectCase(initialCaseId)
    }
  }, [initialCaseId])

  useEffect(() => {
    // Scroll to bottom of chat when messages update
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages]) // Updated dependency to only track the length of messages

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "doctor",
        content: inputMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
      setInputMessage("")
      // Here you would typically send the message to your AI service
      // and then add the AI's response to the messages
      simulateAIResponse()
    }
  }

  const simulateAIResponse = () => {
    // This is a mock AI response. Replace with actual AI integration.
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content:
          "Based on the symptoms described, the patient may be experiencing hypertension. I recommend checking their blood pressure and reviewing their medical history for any risk factors. Would you like me to provide some treatment guidelines?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const handleStartNewCase = () => {
    const newCaseId = `C${(cases.length + 1).toString().padStart(3, "0")}`
    const newCase: Case = {
      id: newCaseId,
      diagnosis: "New Case",
      lastUpdate: new Date(),
      status: "ongoing",
    }
    setCases((prev) => [...prev, newCase])
    setSelectedCase(newCaseId)
    setMessages([
      {
        id: "new-case",
        sender: "ai",
        content: "A new case has been started. What symptoms or concerns would you like to discuss for this patient?",
        timestamp: new Date(),
      },
    ])
  }

  const handleSelectCase = (caseId: string) => {
    setSelectedCase(caseId)
    // Here you would typically fetch the messages for this case
    // This is a mock implementation
    setMessages([
      {
        id: "1",
        sender: "doctor",
        content: "Patient complains of persistent headaches and dizziness.",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        sender: "ai",
        content:
          "These symptoms could be indicative of hypertension. I recommend checking the patient's blood pressure and reviewing their medical history for any risk factors.",
        timestamp: new Date(Date.now() - 3540000),
      },
    ])
  }

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
      )
    }, 1000)
  }

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
              key={caseItem.id}
              className={`mb-2 cursor-pointer ${selectedCase === caseItem.id ? "border-primary" : ""}`}
              onClick={() => handleSelectCase(caseItem.id)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">
                  {caseItem.id}: {caseItem.diagnosis}
                </CardTitle>
                <p className="text-xs text-gray-500">{caseItem.lastUpdate.toLocaleDateString()}</p>
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
              className={`flex ${message.sender === "doctor" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`max-w-3/4 p-3 rounded-lg whitespace-pre-wrap ${
                  message.sender === "doctor" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.content}
                <div className="text-xs mt-1 text-gray-400">{message.timestamp.toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between mt-2">
            <Button variant="outline" size="sm">
              <BookOpen className="mr-2 h-4 w-4" /> View Related Research
            </Button>
            <Button variant="outline" size="sm">
              <AlertTriangle className="mr-2 h-4 w-4" /> Generate Prescription
            </Button>
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" /> Finalize & Save Case
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - AI Insights & Recommendations */}
      <div className="w-64 bg-white p-4 border-l">
        <h3 className="font-bold mb-4">AI Insights</h3>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm">Suggested Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Hypertension (95% confidence)</p>
            <p className="text-sm">Anxiety Disorder (75% confidence)</p>
          </CardContent>
        </Card>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm">Treatment Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">1. Lifestyle modifications</p>
            <p className="text-sm">2. Consider ACE inhibitors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Relevant Research</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <a href="#" className="text-blue-500 hover:underline">
                Recent study on hypertension management (2023)
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

