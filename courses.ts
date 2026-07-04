import { Course } from "../types";

export const SEED_COURSES: Course[] = [
  {
    id: "c1",
    title: "Class 9-10 Physics: Mechanics & Energy",
    description: "Complete preparation for SSC Physics covering Mechanics, Force, Work, Power, and Energy. Designed according to the NCTB curriculum.",
    category: "Academic",
    subcategory: "SSC Preparation",
    instructorName: "Dr. Rakib Hasan (BUET)",
    price: 1500,
    rating: 4.8,
    duration: "25 hours",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60",
    studentsEnrolled: 1240,
    isPopular: true,
    lessons: [
      { id: "l1_1", title: "1. Physical Quantities and Manipulation", duration: "45:00", notes: "Physics starts with measurements. Understand base and derived quantities." },
      { id: "l1_2", title: "2. Motion, Speed, Velocity and Acceleration", duration: "55:00", notes: "Formulas for motion: v = u + at, s = ut + 0.5at^2." },
      { id: "l1_3", title: "3. Newton's Laws and Forces", duration: "1:02:00", notes: "Newton's second law F = ma is central to mechanics." },
      { id: "l1_4", title: "4. Work, Power and Kinetic Energy", duration: "48:00", notes: "Calculating potential energy mgh and kinetic energy 0.5mv^2." }
    ],
    quizzes: [
      {
        id: "q1",
        title: "Mechanics Chapter Test",
        questions: [
          {
            id: "q1_1",
            question: "A car starts from rest and accelerates uniformly at 2 m/s² for 5 seconds. What is its final velocity?",
            options: ["5 m/s", "10 m/s", "15 m/s", "20 m/s"],
            correctAnswerIndex: 1,
            explanation: "Using v = u + at, v = 0 + 2 * 5 = 10 m/s."
          },
          {
            id: "q1_2",
            question: "What is the SI unit of power?",
            options: ["Joule", "Newton", "Watt", "Pascal"],
            correctAnswerIndex: 2,
            explanation: "Power is the rate of doing work, Joule/second, which is called Watt."
          }
        ]
      }
    ]
  },
  {
    id: "c2",
    title: "HSC Higher Mathematics: Calculus & Coordinate Geometry",
    description: "Master differential & integral calculus, along with straight lines and circles, specifically targeted for HSC board exams and engineering admissions.",
    category: "Academic",
    subcategory: "HSC Science",
    instructorName: "Engr. Sajjad Hossain",
    price: 2200,
    rating: 4.9,
    duration: "32 hours",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60",
    studentsEnrolled: 3420,
    isPopular: true,
    lessons: [
      { id: "l2_1", title: "1. Functions and Limits", duration: "50:00" },
      { id: "l2_2", title: "2. Differential Calculus: Differentiation from First Principles", duration: "1:15:00" },
      { id: "l2_3", title: "3. Applications of Differentiation: Maxima & Minima", duration: "1:10:00" },
      { id: "l2_4", title: "4. Integral Calculus: Definite Integrals", duration: "1:25:00" }
    ],
    quizzes: [
      {
        id: "q2",
        title: "Calculus Basic Quiz",
        questions: [
          {
            id: "q2_1",
            question: "What is the derivative of x² with respect to x?",
            options: ["x", "2x", "2", "x³/3"],
            correctAnswerIndex: 1,
            explanation: "Using the power rule d/dx(x^n) = n*x^(n-1), we get d/dx(x²) = 2x."
          }
        ]
      }
    ]
  },
  {
    id: "c3",
    title: "BUET & Medical Integrated Admission Preparation",
    description: "Highly intensive training with past-year problem-solving, shortcuts, conceptual depth-charges, and mock exams for university admissions.",
    category: "Admission",
    subcategory: "Engineering Admission",
    instructorName: "Dr. Mashruf Ahmed (DMC) & Team BUET",
    price: 4500,
    rating: 4.95,
    duration: "80 hours",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60",
    studentsEnrolled: 8900,
    isPopular: true,
    lessons: [
      { id: "l3_1", title: "1. Organic Chemistry: Reaction Mechanisms", duration: "1:40:00" },
      { id: "l3_2", title: "2. Electromagnetic Induction & Alternating Current", duration: "2:00:00" },
      { id: "l3_3", title: "3. Genetics and Evolution: Medical Focus", duration: "1:30:00" }
    ]
  },
  {
    id: "c4",
    title: "46th BCS Preliminary Comprehensive Masterclass",
    description: "Complete guide to BCS Preliminary Exams covering Bengali, English, Bangladesh Affairs, International Affairs, Math, and Mental Ability.",
    category: "Government",
    subcategory: "BCS",
    instructorName: "Kabir Hossain (BCS Admin Cadre)",
    price: 3000,
    rating: 4.75,
    duration: "120 hours",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=60",
    studentsEnrolled: 15300,
    isPopular: true,
    lessons: [
      { id: "l4_1", title: "1. Bengali Literature: Ancient & Medieval Period", duration: "1:15:00" },
      { id: "l4_2", title: "2. English Literature: Golden Ages and Authors", duration: "1:30:00" },
      { id: "l4_3", title: "3. Geography and Disaster Management of Bangladesh", duration: "1:10:00" }
    ],
    quizzes: [
      {
        id: "q4",
        title: "BCS Mock Quiz",
        questions: [
          {
            id: "q4_1",
            question: "Who is the writer of 'Charyapada', the earliest work of Bengali literature?",
            options: ["Luyipa", "Kanhapa", "Bhusukupa", "Multiple Poets"],
            correctAnswerIndex: 3,
            explanation: "Charyapada is an anthology compiled by multiple Buddhist Siddhacharyas (poets) like Luyipa, Kanhapa, Bhusukupa."
          }
        ]
      }
    ]
  },
  {
    id: "c5",
    title: "Full-Stack Web Development: React & Node.js",
    description: "Go from absolute zero to a professional software engineer. Learn HTML, CSS, Tailwind, JS, TypeScript, React, Express, PostgreSQL, and Deployments.",
    category: "Skills",
    subcategory: "Web Development",
    instructorName: "Zahidul Islam (Senior Software Engineer)",
    price: 5000,
    rating: 4.9,
    duration: "110 hours",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60",
    studentsEnrolled: 6400,
    isPopular: true,
    lessons: [
      { id: "l5_1", title: "1. JavaScript ES6+ Foundations", duration: "1:12:00" },
      { id: "l5_2", title: "2. React Component Lifecycle & Hooks", duration: "1:45:00" },
      { id: "l5_3", title: "3. Creating RESTful APIs with Express", duration: "1:30:00" },
      { id: "l5_4", title: "4. PostgreSQL Schema Design and Indexing", duration: "1:20:00" }
    ],
    quizzes: [
      {
        id: "q5",
        title: "React Foundations Test",
        questions: [
          {
            id: "q5_1",
            question: "Which hook should be used to fetch data once after the component mounts?",
            options: ["useState", "useEffect with empty dependencies", "useMemo", "useCallback"],
            correctAnswerIndex: 1,
            explanation: "useEffect with an empty dependency array runs exactly once after the initial render."
          }
        ]
      }
    ]
  },
  {
    id: "c6",
    title: "IELTS Premium Prep: Band 8.0 Target Masterclass",
    description: "Proven strategies for Listening, Reading, Writing, and Speaking modules with feedback sessions, sample mock tests, and cue cards.",
    category: "Language",
    subcategory: "English",
    instructorName: "Farhan Tanvir (Band 8.5)",
    price: 3500,
    rating: 4.85,
    duration: "40 hours",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60",
    studentsEnrolled: 4800,
    isPopular: false,
    lessons: [
      { id: "l6_1", title: "1. IELTS Academic Writing Task 1: Describing Charts", duration: "1:00:00" },
      { id: "l6_2", title: "2. Reading Strategies: Skimming & Scanning", duration: "1:15:00" },
      { id: "l6_3", title: "3. IELTS Speaking Part 2 Cue Card Mastery", duration: "1:10:00" }
    ]
  },
  {
    id: "c7",
    title: "Corporate Communication & Executive Interview Mastery",
    description: "Transform your professional career. Build dynamic resumes, optimize LinkedIn profiles, draft corporate emails, and ace high-pressure interviews.",
    category: "Professional",
    subcategory: "Interview Preparation",
    instructorName: "Farhana Chowdhury (HR Director)",
    price: 2500,
    rating: 4.8,
    duration: "18 hours",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=60",
    studentsEnrolled: 2300,
    isPopular: false,
    lessons: [
      { id: "l7_1", title: "1. High-Impact CV and Resume Engineering", duration: "45:00" },
      { id: "l7_2", title: "2. Strategic Networking on LinkedIn", duration: "50:00" },
      { id: "l7_3", title: "3. Situational Interview Simulation (STAR Method)", duration: "1:15:00" }
    ]
  }
];
