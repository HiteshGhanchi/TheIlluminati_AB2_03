"use client";

import type React from "react";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageSquare, Download, Mail, Plus } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PatientProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock patient data
  const [patient, setPatient] = useState({
    _id: id,
    name: "John Doe",
    age: 45,
    sex: "Male",
    bloodGroup: "A+",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    lastVisit: "2023-06-01",
    height: "175 cm",
    weight: "80 kg",
    bmi: "26.1",
    occupation: "Teacher",
    emergencyContact: "Jane Doe (Wife) - +1 234 567 8901",
    policyNumber: "HG123456789",
    upcomingAppointment: "2023-07-10",
    vaccinationStatus: "Up to date",
    familyHistory: "Father: Hypertension, Mother: Type 2 Diabetes",
  });

  const handleDownload = async (prescription) => {
    console.log("Download button clicked");
    try {
        // Construct structured HTML content
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <h1 style="color: #007BFF;">Prescription</h1>
                <hr>
                <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse; text-align: left;">
                    <tr style="background-color: #f2f2f2;">
                        <th>Doctor ID</th>
                        <th>Case ID</th>
                        <th>Prescription Name</th>
                        <th>Dosage</th>
                    </tr>
                    ${prescription.medicines.map(med => `
                        <tr>
                            <td>${prescription.doctor_id || "N/A"}</td>
                            <td>${prescription.case_id || "N/A"}</td>
                            <td>${med.name || "No name provided"}</td>
                            <td>${med.dosage || "No dosage provided"}</td>
                        </tr>
                    `).join("")}
                </table>
                <br>
                <h3 style="color: #FF5733;">Notes</h3>
                <p>${prescription.notes || "No additional notes provided"}</p>
            </div>
        `;

        const res = await axios.post(
            `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/text_pdf`,
            { info: htmlContent },
            { responseType: "blob" } // Ensures binary response
        );

        console.log(res);

        // Convert response into a Blob
        const blob = new Blob([res.data], { type: "application/pdf" });
        const link = document.createElement("a");

        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", "prescription.pdf");

        // Append to body, trigger click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (e) {
        console.log(e);
    }
};

  const handlePdfEmail = async (prescription) => {
    try{
      console.log(prescription.case_id);
      
      const res = await axios.post(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/send_mail/${prescription.case_id}` )
      console.log(res);
      
    }catch(e){
      console.log(e);
    }
  }

  useEffect(() => {
    const sendReq = async () => {
      try {
        const res = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/patient/${id}`
        );
        // console.log(res);
        // console.log(calculateBMI(res.data.data.height , res.data.data.weight));

        setPatient((data) => ({
          ...data,
          ...res.data.data,
          bmi: calculateBMI(res.data.data.height, res.data.data.weight) || "15",
          lastVisit: String(res.data.data.created_at).substring(0, 10),
        }));
      } catch (e) {
        console.log(e);
      }
    };
    sendReq();
  }, []);

  const calculateBMI = (h, w) => {
    if (h && w) {
      const heightInMeters = h / 100;
      const bmiValue = (w / (heightInMeters * heightInMeters)).toFixed(2);
      return bmiValue;
    }
  };

  const [caseHistory, setCaseHistory] = useState([
    {
      id: "C001",
      diagnosis: "Influenza",
      lastUpdate: "2023-05-15",
      status: "Resolved",
    },
    {
      id: "C002",
      diagnosis: "Hypertension Follow-up",
      lastUpdate: "2023-06-01",
      status: "Ongoing",
    },
    {
      id: "C003",
      diagnosis: "Diabetes Management",
      lastUpdate: "2023-06-01",
      status: "Ongoing",
    },
  ]);

  useEffect(() => {
    const sendReq = async () => {
      try {
        const res = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/cases/${id}`
        );
        // console.log(res);
        setCaseHistory(res.data.cases);
      } catch (e) {
        console.log(e);
      }
    };
    sendReq();
  }, []);

  const [prescriptions, setPrescriptions] = useState([
    {
      id: "67c325274b854f514b39eef1",
      date: "2023-05-15",
      medicines: "Oseltamivir",
      dosage: "75mg twice daily",
      notes: "Take with food",
    },
    {
      id: "P002",
      date: "2023-06-01",
      medicines: "Lisinopril",
      dosage: "10mg once daily",
      notes: "Monitor blood pressure",
    },
    {
      id: "P003",
      date: "2023-06-01",
      medicines: "Metformin",
      dosage: "500mg twice daily",
      notes: "Take with meals",
    },
  ]);

  useEffect(() => {
    const sendReq = async() => {
      try{
        const response = await axios.get(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/prescription/${id}`)
        console.log(response);
        setPrescriptions(response.data.data.prescriptions)
      } catch(e){
        console.log(e);
      }
    }
    sendReq()
  } , [])

  const [newPrescription, setNewPrescription] = useState({
    date: "",
    medicines: "",
    dosage: "",
    notes: "",
  });

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(newPrescription);
    
    try{
      const create = await axios.post(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/prescription/create-prescription`,{
        case_id : newPrescription.medicalCase,
        doctor_id : localStorage.getItem("doctor_id"),
        medicine : newPrescription.medicines,
        dosage : newPrescription.dosage,
        notes : newPrescription.notes
      })

      console.log(create);
      
    }catch(e){
      console.log(e);
    }
  };

  const handleOpenChat = () => {
    router.push(`/patient/${id}/chat`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">DocGPT</h1>
              <span className="text-xl font-semibold">Patient Profile</span>
            </div>
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Doctor" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="p-6">
          <Card className="mb-6">
            <CardContent className="flex items-center space-x-4 p-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt={patient.name} />
                <AvatarFallback>
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <p className="text-muted-foreground">
                  Patient ID: {patient._id}
                </p>
                <div className="mt-2 flex space-x-2">
                  <Badge>{patient.age} years old</Badge>
                  <Badge>{patient.sex}</Badge>
                  <Badge variant="outline">
                    Blood Type: {patient.bloodGroup}
                  </Badge>
                </div>
                <div className="mt-2">
                  <Badge variant="destructive">
                    Allergies: {patient.allergies.join(", ")}
                  </Badge>
                </div>
                {/* <div className="mt-2"> */}
                {/* <Badge variant="secondary">Chronic: {patient.chronicConditions.join(", ")}</Badge> */}
                {/* </div> */}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cases">Cases</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Personal Information</h3>
                      <p>Height: {patient.height}</p>
                      <p>Weight: {patient.weight}</p>
                      <p>BMI: {patient.bmi}</p>
                      <p>Occupation: {patient.occupation}</p>
                      <p>Emergency Contact: {patient.emergencyContact}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Medical Information</h3>
                      <p>
                        Primary Care Physician: {patient.primaryCarePhysician}
                      </p>
                      <p>Insurance Provider: {patient.insuranceProvider}</p>
                      <p>Policy Number: {patient.policyNumber}</p>
                      {/* <p>Last Lab Work: {patient.lastLabWork}</p> */}
                      <p>Upcoming Appointment: {patient.upcomingAppointment}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold">Additional Information</h3>
                    <p>Vaccination Status: {patient.vaccinationStatus}</p>
                    <p>Family History: {patient.familyHistory}</p>
                    <p>Last Visit: {patient.lastVisit}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cases" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Case History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case ID</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {caseHistory.map((caseItem) => (
                        <TableRow key={caseItem._id}>
                          <TableCell>{caseItem._id}</TableCell>
                          <TableCell>
                            {String(caseItem.created_at).substring(0, 10)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                caseItem.status === "ongoing"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {caseItem.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button onClick={handleOpenChat}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Open AI Chat
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="prescriptions" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Prescription History</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Prescription
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Prescription</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleAddPrescription}
                        className="space-y-4"
                      >
                        {/* Date Field */}
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newPrescription.date}
                            onChange={(e) =>
                              setNewPrescription({
                                ...newPrescription,
                                date: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        {/* Medical Case Selection */}
                        <div>
                          <Label htmlFor="medicalCase">Medical Case</Label>
                          <select
                            id="medicalCase"
                            value={newPrescription.medicalCase}
                            onChange={(e) =>
                              setNewPrescription({
                                ...newPrescription,
                                medicalCase: e.target.value,
                              })
                            }
                            className="w-full p-2 border rounded mt-1"
                            required
                          >
                            <option value="">Select a case</option>
                            {caseHistory.map((caseItem, index) => (
                              <option key={index} value={caseItem._id}>
                                {caseItem._id}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Prescription Name */}
                        <div>
                          <Label htmlFor="medicines">Prescription Name</Label>
                          <Input
                            id="medicines"
                            value={newPrescription.medicines}
                            onChange={(e) =>
                              setNewPrescription({
                                ...newPrescription,
                                medicines: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        {/* Dosage */}
                        <div>
                          <Label htmlFor="dosage">Dosage (ml)</Label>
                          <Input
                            id="dosage"
                            value={newPrescription.dosage}
                            onChange={(e) =>
                              setNewPrescription({
                                ...newPrescription,
                                dosage: e.target.value,
                              })
                            }
                            placeholder="ml"
                            required
                          />
                        </div>

                        {/* Prescription Notes */}
                        <div>
                          <Label htmlFor="notes">Prescription Notes</Label>
                          <textarea
                            id="notes"
                            value={newPrescription.notes}
                            onChange={(e) =>
                              setNewPrescription({
                                ...newPrescription,
                                notes: e.target.value,
                              })
                            }
                            className="w-full p-2 border rounded mt-1"
                            rows="3"
                            placeholder="Enter prescription notes..."
                          />
                        </div>

                        {/* Submit Button */}
                        <Button onSubmit={handleAddPrescription} type="submit">Add Prescription</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prescription ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Medicines</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Case ID</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prescriptions.map((prescription) => (
                        <TableRow key={prescription.id}>
                          <TableCell>{prescription._id}</TableCell>
                          <TableCell>{String(prescription.created_at).substring(0,10)}</TableCell>
                          <TableCell>{prescription.medicines[0].name}</TableCell>
                          <TableCell>{prescription.medicines[0].dosage}</TableCell>
                          <TableCell>{prescription.notes}</TableCell>
                          <TableCell>{prescription.case_id}</TableCell>
                          <TableCell>
                            <Button onClick={() => handleDownloadPrescription(prescription)} variant="ghost" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            <Button onClick={() => handlePdfEmail(prescription)} variant="ghost" size="sm">
                              <Mail className="mr-2 h-4 w-4" />
                              Email
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
