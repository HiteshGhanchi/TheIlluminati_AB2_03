"use client"

import { useParams, useRouter } from "next/navigation"
import AIChatInterface from "@/components/AIChatInterface"

export default function PatientChatPage() {
  const { id } = useParams()
  const router = useRouter()

  const handleClose = () => {
    router.push(`/patient/${id}`)
  }

  return <AIChatInterface patientId={id as string} initialCaseId={null} onClose={handleClose} />
}

