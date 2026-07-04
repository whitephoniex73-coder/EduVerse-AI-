export type UserRole =
  | "Student"
  | "Parent"
  | "Teacher"
  | "Instructor"
  | "Mentor"
  | "Content Creator"
  | "Affiliate Partner"
  | "Moderator"
  | "Admin"
  | "Super Admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  parentId?: string; // linkage for Parent-Student relationship
  linkedStudentIds?: string[]; // for Parents
  xp: number;
  streak: number;
  level: number;
  badges: string[];
  lastActive: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g., "12:34"
  videoUrl?: string; // placeholder or direct link
  pdfUrl?: string;
  notes?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: "Academic" | "Admission" | "Government" | "Skills" | "Language" | "Professional";
  subcategory: string; // e.g., "Class 9", "BCS", "Web Development", "HSC Science"
  instructorName: string;
  price: number; // e.g., 2500 BDT
  rating: number;
  duration: string;
  lessons: Lesson[];
  quizzes?: Quiz[];
  studentsEnrolled: number;
  image: string;
  isPopular?: boolean;
}

export interface LiveSession {
  id: string;
  title: string;
  category: string;
  instructorName: string;
  scheduledAt: string;
  status: "upcoming" | "live" | "ended";
  enrolledCount: number;
  polls?: {
    id: string;
    question: string;
    options: string[];
    votes: number[];
    votedUsers: { [userId: string]: number };
  }[];
  chats?: {
    id: string;
    user: string;
    role: string;
    message: string;
    time: string;
  }[];
  whiteboardData?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorRole: string;
  upvotes: number;
  createdAt: string;
  replies: {
    id: string;
    authorName: string;
    authorRole: string;
    content: string;
    createdAt: string;
  }[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  issuedAt: string;
  qrCodeUrl: string;
}

export interface Transaction {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: "BDT" | "USD";
  gateway: "bKash" | "Nagad" | "Rocket" | "SSLCommerz" | "Stripe" | "PayPal";
  status: "pending" | "completed" | "failed";
  couponCode?: string;
  createdAt: string;
}

export interface FeatureFlags {
  coursePurchase: boolean;
  subscriptionPlans: boolean;
  premiumMembership: boolean;
  couponSystem: boolean;
  affiliateProgram: boolean;
}
