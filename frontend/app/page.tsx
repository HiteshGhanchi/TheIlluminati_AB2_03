import Image from "next/image"
import Link from "next/link"
import {
  Brain,
  BookOpen,
  Search,
  Stethoscope,
  Bot,
  ChevronRight,
  Play,
  Lock,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HealthcareLanding() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">DocGPT</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#demo" className="text-sm font-medium hover:text-primary">
              Demo
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
              Testimonials
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {/* <Button variant="outline" className="hidden md:flex">
              Contact
            </Button> */}
            <Link href="/login">
              <Button>
                Login
                <Lock className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
          <div className="container grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20">AI-Powered Healthcare</Badge>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Revolutionizing Medical Decision-Making with AI 🏥
              </h1>
              <p className="text-xl text-muted-foreground">
                AI-powered Clinical Decision Support for Real-Time Insights
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  See How It Works
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=500&width=500"
                width={500}
                height={500}
                alt="Doctor using AI dashboard"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-48 -top-48 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        </section>

        {/* Key Features */}
        <section id="features" className="py-16 md:py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Key Features</Badge>
              <h2 className="text-3xl font-bold md:text-4xl">Empowering Medical Professionals</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Our AI-powered platform provides doctors with cutting-edge tools to enhance diagnosis, treatment
                planning, and patient care.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Brain className="h-10 w-10 text-primary" />}
                title="AI-Powered Diagnosis Support"
                description="Get intelligent diagnostic suggestions based on patient symptoms, medical history, and the latest research."
              />
              <FeatureCard
                icon={<BookOpen className="h-10 w-10 text-primary" />}
                title="Real-Time Medical Research"
                description="Access the latest medical research, clinical trials, and treatment guidelines instantly."
              />
              <FeatureCard
                icon={<Search className="h-10 w-10 text-primary" />}
                title="Drug Interaction Detection"
                description="Identify potential drug interactions and side effects before prescribing medications."
              />
              <FeatureCard
                icon={<Stethoscope className="h-10 w-10 text-primary" />}
                title="Patient-Specific Insights"
                description="Receive personalized recommendations based on individual patient data and medical history."
              />
              <FeatureCard
                icon={<Bot className="h-10 w-10 text-primary" />}
                title="AI Chatbot Assistant"
                description="Get immediate answers to medical queries with our specialized medical AI assistant."
              />
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10 text-primary" />}
                title="Clinical Decision Support"
                description="Validate your clinical decisions with AI-powered analysis and evidence-based recommendations."
              />
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">See It In Action</Badge>
              <h2 className="text-3xl font-bold md:text-4xl">Experience the Power of Medical AI</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Watch how our platform assists doctors in making faster, more accurate clinical decisions.
              </p>
            </div>

            <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border bg-white shadow-lg">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" variant="outline" className="rounded-full h-16 w-16">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  width={1280}
                  height={720}
                  alt="Demo video thumbnail"
                  className="h-full w-full object-cover opacity-80"
                />
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-center text-2xl font-bold mb-8">Interactive Walkthrough</h3>
              <Carousel className="mx-auto max-w-5xl">
                <CarouselContent>
                  {[
                    {
                      title: "Input Patient Data",
                      description: "Enter patient symptoms, medical history, and current medications.",
                    },
                    {
                      title: "AI Analysis",
                      description: "Our AI analyzes the data and retrieves relevant medical information.",
                    },
                    {
                      title: "Personalized Recommendations",
                      description: "Receive patient-specific diagnostic and treatment recommendations.",
                    },
                    {
                      title: "Apply Clinical Insights",
                      description: "Use AI-generated insights to inform your clinical decision-making.",
                    },
                  ].map((step, index) => (
                    <CarouselItem key={index}>
                      <Card className="border-0 shadow-none">
                        <CardContent className="flex flex-col md:flex-row gap-6 p-6">
                          <div className="flex-1 flex items-center justify-center">
                            <Image
                              src={`/placeholder.svg?height=300&width=400&text=Step ${index + 1}`}
                              width={400}
                              height={300}
                              alt={`Step ${index + 1}: ${step.title}`}
                              className="rounded-lg shadow-md"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center space-y-4">
                            <Badge className="w-fit">Step {index + 1}</Badge>
                            <h4 className="text-xl font-bold">{step.title}</h4>
                            <p className="text-muted-foreground">{step.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-4">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 md:py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Testimonials</Badge>
              <h2 className="text-3xl font-bold md:text-4xl">Trusted by Medical Professionals</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Hear what doctors have to say about our AI-powered clinical decision support system.
              </p>
            </div>

            <Carousel className="mx-auto max-w-5xl">
              <CarouselContent>
                {[
                  {
                    name: "Dr. Sarah Johnson",
                    role: "Cardiologist, Memorial Hospital",
                    quote:
                      "This AI platform has transformed my practice. I can quickly access the latest research and get personalized recommendations for my patients.",
                    image: "/placeholder.svg?height=100&width=100",
                  },
                  {
                    name: "Dr. Michael Chen",
                    role: "Neurologist, University Medical Center",
                    quote:
                      "The diagnostic support has been invaluable. It's like having a team of specialists at my fingertips, helping me consider all possible diagnoses.",
                    image: "/placeholder.svg?height=100&width=100",
                  },
                  {
                    name: "Dr. Emily Rodriguez",
                    role: "Primary Care Physician",
                    quote:
                      "The drug interaction detection feature has helped me avoid potential medication errors. It's an essential safety net for my practice.",
                    image: "/placeholder.svg?height=100&width=100",
                  },
                ].map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-0 shadow-xl">
                      <CardContent className="p-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md">
                            <Image
                              src={testimonial.image || "/placeholder.svg"}
                              width={100}
                              height={100}
                              alt={testimonial.name}
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg italic">"{testimonial.quote}"</p>
                            <div>
                              <h4 className="font-semibold">{testimonial.name}</h4>
                              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
              <StatCard value="98%" label="Accuracy in AI Recommendations" icon="🚀" />
              <StatCard value="5,000+" label="Research Papers Indexed Daily" icon="🔬" />
              <StatCard value="100+" label="Healthcare Institutions Using Our Platform" icon="🏥" />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Process</Badge>
              <h2 className="text-3xl font-bold md:text-4xl">How It Works</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Our streamlined process helps doctors make informed clinical decisions quickly and accurately.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <Search className="h-10 w-10" />,
                  title: "Input Query",
                  description: "Enter patient details or ask a specific medical question.",
                },
                {
                  icon: <BookOpen className="h-10 w-10" />,
                  title: "AI Research",
                  description: "AI fetches relevant research, guidelines, and case studies.",
                },
                {
                  icon: <Brain className="h-10 w-10" />,
                  title: "Data Analysis",
                  description: "AI analyzes EHR data for personalized patient insights.",
                },
                {
                  icon: <Stethoscope className="h-10 w-10" />,
                  title: "Clinical Insights",
                  description: "Receive diagnosis and treatment recommendations.",
                },
              ].map((step, index) => (
                <div key={index} className="relative flex flex-col items-center text-center">
                  {index < 3 && (
                    <div className="absolute hidden lg:block right-0 top-10 w-full h-0.5 bg-primary/20">
                      <ChevronRight className="absolute -right-3 -top-2 h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">FAQ</Badge>
              <h2 className="text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Find answers to common questions about our AI-powered medical platform.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How does the AI ensure accuracy in its recommendations?",
                    answer:
                      "Our AI is trained on millions of peer-reviewed medical papers, clinical guidelines, and case studies. It undergoes rigorous validation by medical experts and is continuously updated with the latest research. The system provides confidence scores with each recommendation and always cites its sources.",
                  },
                  {
                    question: "Is patient data secure on the platform?",
                    answer:
                      "Yes, we take data security very seriously. All patient data is encrypted end-to-end, and our platform is fully HIPAA and GDPR compliant. We implement strict access controls, and data is never shared with third parties without explicit consent.",
                  },
                  {
                    question: "Can the AI replace a doctor's clinical judgment?",
                    answer:
                      "No, our AI is designed to augment, not replace, a doctor's expertise. It serves as a decision support tool that provides evidence-based recommendations, but the final clinical decision always rests with the healthcare professional.",
                  },
                  {
                    question: "How often is the medical database updated?",
                    answer:
                      "Our medical database is updated daily with the latest research papers, clinical trials, and treatment guidelines. The AI continuously learns from new data to improve its recommendations.",
                  },
                  {
                    question: "Is training required to use the platform?",
                    answer:
                      "The platform is designed to be intuitive and user-friendly. We provide comprehensive onboarding resources, including video tutorials and documentation. Additionally, our support team is available to assist with any questions.",
                  },
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mx-auto max-w-lg rounded-lg bg-primary/5 p-6 text-center">
              <h3 className="text-xl font-bold">Still have questions?</h3>
              <p className="mt-2 text-muted-foreground">Our support team is ready to assist you with any inquiries.</p>
              <Button className="mt-4">Contact Support</Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">DocGPT</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered clinical decision support for healthcare professionals.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="text-muted-foreground hover:text-primary">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="text-muted-foreground hover:text-primary">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground hover:text-primary">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    HIPAA Compliance
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    GDPR Compliance
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>support@mediai.com</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+1 (800) 123-4567</span>
                </li>
              </ul>
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  Hospital Partnerships
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} DocGPT. All rights reserved.</p>
            <div className="mt-2 flex items-center justify-center space-x-4">
              <Badge variant="outline" className="font-normal">
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="font-normal">
                GDPR Compliant
              </Badge>
              <Badge variant="outline" className="font-normal">
                ISO 27001 Certified
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Component for feature cards
function FeatureCard({ icon, title, description }) {
  return (
    <div className="group rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

// Component for statistic cards
function StatCard({ value, label, icon }) {
  return (
    <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-primary">{value}</div>
      <p className="mt-1 text-muted-foreground">{label}</p>
    </div>
  )
}

