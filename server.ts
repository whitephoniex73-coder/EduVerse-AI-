import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { SEED_COURSES } from "./src/data/courses";
import { User, Course, LiveSession, ForumPost, Certificate, Transaction, FeatureFlags } from "./src/types";

// In-Memory Database State
const db = {
  users: [
    {
      id: "student1",
      email: "student@eduverse.ai",
      name: "Rafid Rahman",
      role: "Student",
      parentId: "parent1",
      xp: 2450,
      streak: 5,
      level: 4,
      badges: ["First Steps", "Streak Master", "Quiz Whiz"],
      lastActive: new Date().toISOString()
    },
    {
      id: "parent1",
      email: "parent@eduverse.ai",
      name: "M. Rahman",
      role: "Parent",
      linkedStudentIds: ["student1"],
      xp: 150,
      streak: 0,
      level: 1,
      badges: ["Involved Parent"],
      lastActive: new Date().toISOString()
    },
    {
      id: "instructor1",
      email: "instructor@eduverse.ai",
      name: "Dr. Rakib Hasan",
      role: "Instructor",
      xp: 5800,
      streak: 12,
      level: 9,
      badges: ["Elite Educator", "Community Pillar"],
      lastActive: new Date().toISOString()
    },
    {
      id: "admin1",
      email: "admin@eduverse.ai",
      name: "Sayeeda Karim",
      role: "Admin",
      xp: 10200,
      streak: 42,
      level: 15,
      badges: ["Platform Guardian", "Super Moderator"],
      lastActive: new Date().toISOString()
    }
  ] as User[],

  currentUser: {
    id: "student1",
    email: "student@eduverse.ai",
    name: "Rafid Rahman",
    role: "Student",
    parentId: "parent1",
    xp: 2450,
    streak: 5,
    level: 4,
    badges: ["First Steps", "Streak Master", "Quiz Whiz"],
    lastActive: new Date().toISOString()
  } as User,

  courses: [...SEED_COURSES] as Course[],

  enrolledCourses: ["c1", "c5"] as string[], // Rafid's starting enrolled courses

  completedLessons: ["l1_1"] as string[], // Rafid's starting completed lessons

  liveSessions: [
    {
      id: "live1",
      title: "Interactive Live Class: Class 9-10 Newtonian Physics Depth-Analysis",
      category: "Academic",
      instructorName: "Dr. Rakib Hasan (BUET)",
      scheduledAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 mins from now
      status: "upcoming",
      enrolledCount: 312,
      polls: [
        {
          id: "p1",
          question: "Which of these quantities is a vector?",
          options: ["Speed", "Mass", "Velocity", "Temperature"],
          votes: [12, 5, 87, 3],
          votedUsers: {}
        }
      ],
      chats: [
        { id: "msg1", user: "Ahsan Habib", role: "Student", message: "Sir, when will we solve previous HSC questions?", time: "11:41 AM" },
        { id: "msg2", user: "Zarin Tasnim", role: "Student", message: "Is momentum conserved in an inelastic collision?", time: "11:42 AM" }
      ],
      whiteboardData: ""
    },
    {
      id: "live2",
      title: "BCS English Vocabulary & Translation Secrets",
      category: "Government",
      instructorName: "Kabir Hossain (BCS Admin Cadre)",
      scheduledAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // Started 30 mins ago
      status: "live",
      enrolledCount: 1450,
      polls: [
        {
          id: "p2",
          question: "Choose the correct synonym of 'Meticulous':",
          options: ["Careful", "Careless", "Dynamic", "Humble"],
          votes: [320, 15, 45, 10],
          votedUsers: {}
        }
      ],
      chats: [
        { id: "m1", user: "Mahmudul", role: "Student", message: "Outstanding class, Sir!", time: "11:43 AM" }
      ],
      whiteboardData: "Vocabulary: Meticulous -> Fastidious -> Thorough"
    }
  ] as LiveSession[],

  forumPosts: [
    {
      id: "post1",
      title: "How to balance BCS prep alongside a full-time software engineering job?",
      content: "Hello everyone, I currently work 9-6 as a React Developer in Dhaka. I want to start preparing for the 46th BCS exam. What is the most effective timeline/schedule to follow? Is 3 hours daily enough?",
      category: "Government Job Prep",
      authorName: "Kazi Ashraful Islam",
      authorRole: "Student",
      upvotes: 28,
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      replies: [
        {
          id: "r1",
          authorName: "Kabir Hossain",
          authorRole: "Mentor",
          content: "As a mentor, I advise focusing 2 hours on core English and Bangladesh Affairs on weekdays. Use weekends fully (8-10 hours) for mathematics and scientific knowledge. High quality consistency beats pure hours.",
          createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
        }
      ]
    },
    {
      id: "post2",
      title: "Need help with integration under Calculus (HSC Class 12)",
      content: "I'm having a hard time understanding the substitution method when integrating trigonometric functions. Could anyone explain with an example?",
      category: "Academic",
      authorName: "Samia Jahan",
      authorRole: "Student",
      upvotes: 12,
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      replies: []
    }
  ] as ForumPost[],

  certificates: [
    {
      id: "EV-CERT-740219",
      courseId: "c1",
      courseTitle: "Class 9-10 Physics: Mechanics & Energy",
      studentId: "student1",
      studentName: "Rafid Rahman",
      issuedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://eduverse.ai/verify/EV-CERT-740219"
    }
  ] as Certificate[],

  transactions: [] as Transaction[],

  featureFlags: {
    coursePurchase: false, // Default disabled as requested
    subscriptionPlans: false,
    premiumMembership: false,
    couponSystem: false,
    affiliateProgram: false
  } as FeatureFlags
};

// Initialize Gemini Client Lazily/Safely
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- ENTERPRISE SECURITY MIDDLEWARES & HARDENING ---

  // Custom Helmet Security Headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Content-Security-Policy", "default-src 'self' https://api.qrserver.com https://images.unsplash.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://api.qrserver.com https://images.unsplash.com;");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

  // Custom CORS Protection
  app.use((req, res, next) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://ais-dev-a4czskph3rluubrjqjscor-34143326247.asia-southeast1.run.app",
      "https://ais-pre-a4czskph3rluubrjqjscor-34143326247.asia-southeast1.run.app"
    ];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  // Custom In-Memory Token Bucket Rate Limiter
  const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
  const RATE_LIMIT_MAX_REQUESTS = 150; // max 150 requests per minute

  app.use((req, res, next) => {
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "anonymous";
    const now = Date.now();
    
    let record = rateLimitStore.get(ip);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
      rateLimitStore.set(ip, record);
    } else {
      record.count++;
    }

    res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS.toString());
    res.setHeader("X-RateLimit-Remaining", Math.max(0, RATE_LIMIT_MAX_REQUESTS - record.count).toString());
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000).toString());

    if (record.count > RATE_LIMIT_MAX_REQUESTS) {
      return res.status(429).json({
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please try again in 1 minute."
      });
    }
    next();
  });

  // Simple Request Audit logger for monitoring and observability
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(`[AUDIT] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Time: ${duration}ms - IP: ${req.ip}`);
    });
    next();
  });

  // --- API ENDPOINTS ---

  // GET /api/certificates/verify/:certificateId
  // Public Certificate Verification Endpoint - Target <100ms with optimized O(1) in-memory or indexed query response
  app.get("/api/certificates/verify/:certificateId", (req, res) => {
    const { certificateId } = req.params;
    const cert = db.certificates.find(
      (c) => c.id.toLowerCase() === certificateId.trim().toLowerCase()
    );
    if (cert) {
      res.json({ verified: true, certificate: cert });
    } else {
      res.status(404).json({ verified: false, error: "Certificate not found" });
    }
  });

  // Get full app state
  app.get("/api/state", (req, res) => {
    res.json({
      currentUser: db.currentUser,
      users: db.users,
      courses: db.courses,
      enrolledCourses: db.enrolledCourses,
      completedLessons: db.completedLessons,
      liveSessions: db.liveSessions,
      forumPosts: db.forumPosts,
      certificates: db.certificates,
      transactions: db.transactions,
      featureFlags: db.featureFlags
    });
  });

  // Switch Active user/role (Student, Instructor, Admin, Parent)
  app.post("/api/auth/switch", (req, res) => {
    const { userId } = req.body;
    const user = db.users.find((u) => u.id === userId);
    if (user) {
      db.currentUser = { ...user };
      // Also adjust active state references if switching back
      res.json({ success: true, currentUser: db.currentUser });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Enroll in course
  app.post("/api/courses/enroll", (req, res) => {
    const { courseId, paymentGateway, couponCode } = req.body;
    const course = db.courses.find((c) => c.id === courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if already enrolled
    if (db.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    // Handle Payment Integration Simulation (modular payment infrastructure)
    if (db.featureFlags.coursePurchase && course.price > 0) {
      // payment gateway is active
      const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      const finalAmount = couponCode === "DISCOUNT50" ? course.price * 0.5 : course.price;
      
      const newTxn: Transaction = {
        id: txnId,
        userId: db.currentUser.id,
        courseId: course.id,
        courseTitle: course.title,
        amount: finalAmount,
        currency: "BDT",
        gateway: paymentGateway || "bKash",
        status: "completed",
        couponCode: couponCode || undefined,
        createdAt: new Date().toISOString()
      };

      db.transactions.push(newTxn);
    }

    // Add to enrolled
    db.enrolledCourses.push(courseId);
    res.json({ success: true, enrolledCourses: db.enrolledCourses, transactions: db.transactions });
  });

  // Complete a lesson
  app.post("/api/courses/lesson-complete", (req, res) => {
    const { lessonId } = req.body;
    if (!db.completedLessons.includes(lessonId)) {
      db.completedLessons.push(lessonId);
      // Award XP
      db.currentUser.xp += 100;
      db.currentUser.level = Math.floor(db.currentUser.xp / 800) + 1;
      
      // Update in user list
      const userIdx = db.users.findIndex((u) => u.id === db.currentUser.id);
      if (userIdx !== -1) {
        db.users[userIdx].xp = db.currentUser.xp;
        db.users[userIdx].level = db.currentUser.level;
      }
    }
    res.json({ success: true, completedLessons: db.completedLessons, currentUser: db.currentUser });
  });

  // Add course (Instructor Dashboard)
  app.post("/api/courses/add-course", (req, res) => {
    const { title, description, category, subcategory, price, duration, lessons } = req.body;
    
    const newCourse: Course = {
      id: `c_${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      description,
      category,
      subcategory,
      instructorName: db.currentUser.name,
      price: Number(price) || 0,
      rating: 5.0,
      duration: duration || "10 hours",
      studentsEnrolled: 0,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60",
      lessons: (lessons || []).map((l: any, i: number) => ({
        id: `l_${Date.now()}_${i}`,
        title: l.title || `Lesson ${i + 1}`,
        duration: l.duration || "10:00",
        notes: l.notes || "No extra notes available."
      }))
    };

    db.courses.push(newCourse);
    res.json({ success: true, courses: db.courses });
  });

  // Quiz submission & dynamic certificate generation
  app.post("/api/courses/quiz-submit", (req, res) => {
    const { courseId, score, totalQuestions } = req.body;
    
    // If score is 100% or above 80%, issue certificate
    const percent = (score / totalQuestions) * 100;
    let certificateIssued = false;
    let newCert: Certificate | null = null;

    if (percent >= 80) {
      const course = db.courses.find((c) => c.id === courseId);
      const alreadyHasCert = db.certificates.some((c) => c.courseId === courseId && c.studentId === db.currentUser.id);
      
      if (course && !alreadyHasCert) {
        const certId = `EV-CERT-${Math.floor(100000 + Math.random() * 900000)}`;
        newCert = {
          id: certId,
          courseId: course.id,
          courseTitle: course.title,
          studentId: db.currentUser.id,
          studentName: db.currentUser.name,
          issuedAt: new Date().toISOString(),
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://eduverse.ai/verify/${certId}`
        };
        db.certificates.push(newCert);
        certificateIssued = true;

        // Add Quiz Whiz / Course Master badge
        if (!db.currentUser.badges.includes("Course Master")) {
          db.currentUser.badges.push("Course Master");
        }
      }
    }

    // Award XP
    db.currentUser.xp += score * 50;
    db.currentUser.level = Math.floor(db.currentUser.xp / 800) + 1;
    
    const userIdx = db.users.findIndex((u) => u.id === db.currentUser.id);
    if (userIdx !== -1) {
      db.users[userIdx].xp = db.currentUser.xp;
      db.users[userIdx].level = db.currentUser.level;
      db.users[userIdx].badges = db.currentUser.badges;
    }

    res.json({
      success: true,
      currentUser: db.currentUser,
      certificates: db.certificates,
      certificateIssued,
      newCert
    });
  });

  // Forum: Post creation
  app.post("/api/forum/create-post", (req, res) => {
    const { title, content, category } = req.body;
    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      title,
      content,
      category,
      authorName: db.currentUser.name,
      authorRole: db.currentUser.role,
      upvotes: 0,
      createdAt: new Date().toISOString(),
      replies: []
    };
    db.forumPosts.unshift(newPost);
    res.json({ success: true, forumPosts: db.forumPosts });
  });

  // Forum: Reply creation
  app.post("/api/forum/reply", (req, res) => {
    const { postId, content } = req.body;
    const post = db.forumPosts.find((p) => p.id === postId);
    if (post) {
      post.replies.push({
        id: `reply_${Date.now()}`,
        authorName: db.currentUser.name,
        authorRole: db.currentUser.role,
        content,
        createdAt: new Date().toISOString()
      });
      res.json({ success: true, forumPosts: db.forumPosts });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  });

  // Live session: Polling and live messages
  app.post("/api/live/poll-vote", (req, res) => {
    const { sessionId, pollId, optionIndex } = req.body;
    const session = db.liveSessions.find((s) => s.id === sessionId);
    if (session && session.polls) {
      const poll = session.polls.find((p) => p.id === pollId);
      if (poll) {
        if (poll.votedUsers[db.currentUser.id] !== undefined) {
          return res.status(400).json({ error: "You already voted in this poll" });
        }
        poll.votes[optionIndex] += 1;
        poll.votedUsers[db.currentUser.id] = optionIndex;
        res.json({ success: true, liveSessions: db.liveSessions });
      } else {
        res.status(404).json({ error: "Poll not found" });
      }
    } else {
      res.status(404).json({ error: "Session or polls not found" });
    }
  });

  app.post("/api/live/chat-send", (req, res) => {
    const { sessionId, message } = req.body;
    const session = db.liveSessions.find((s) => s.id === sessionId);
    if (session) {
      session.chats = session.chats || [];
      session.chats.push({
        id: `chat_${Date.now()}`,
        user: db.currentUser.name,
        role: db.currentUser.role,
        message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      res.json({ success: true, liveSessions: db.liveSessions });
    } else {
      res.status(404).json({ error: "Session not found" });
    }
  });

  // Admin CMS: Feature flags toggle
  app.post("/api/admin/toggle-flag", (req, res) => {
    const { flagName } = req.body;
    const flags = db.featureFlags as any;
    if (flags[flagName] !== undefined) {
      flags[flagName] = !flags[flagName];
      res.json({ success: true, featureFlags: db.featureFlags });
    } else {
      res.status(400).json({ error: "Invalid flag name" });
    }
  });

  // --- AI MODULES VIA SERVER-SIDE GEMINI API ---

  // 1. AI Tutor (Chat, Explain, Summarize)
  app.post("/api/ai/tutor", async (req, res) => {
    const { message, history } = req.body;
    const ai = getAI();

    if (!ai) {
      // Fallback/Mock response when GEMINI_API_KEY is not set
      return res.json({
        text: `[Offline/Demo Mode] EduVerse AI Tutor here! I am currently running without an active Gemini API key. Configure your GEMINI_API_KEY in the secrets menu to activate full AI features. 

        To answer your question: physics, programming, and languages represent beautiful, structured systems. How can I help you map out your study goals today?`
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are a world-class AI Tutor for EduVerse, initially focused on Bangladesh. Explain concepts elegantly and supply clear examples. Here is the user query: ${message}` }]
          }
        ]
      });
      res.json({ text: response.text });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to generate tutor response." });
    }
  });

  // 2. AI Exam/Quiz Generator
  app.post("/api/ai/exam-gen", async (req, res) => {
    const { topic, difficulty } = req.body;
    const ai = getAI();

    if (!ai) {
      // Return high-quality pre-formatted Mock MCQs
      return res.json({
        questions: [
          {
            id: "m_q1",
            question: `What is the primary characteristic of ${topic || "Web Development"}?`,
            options: ["Option A: Client-side routing", "Option B: Strict typing systems", "Option C: High efficiency data structures", "Option D: All of the above"],
            correctAnswerIndex: 3,
            explanation: "All option properties are standard parts of complex modern computer systems."
          },
          {
            id: "m_q2",
            question: `Which concept is vital to master in ${topic || "Web Development"}?`,
            options: ["Static state", "Asynchronous operations", "Linear rendering", "Monolithic compilation"],
            correctAnswerIndex: 1,
            explanation: "Asynchronous behaviors handle APIs and concurrent updates efficiently."
          }
        ]
      });
    }

    try {
      const prompt = `Generate exactly 3 MCQ test questions about "${topic || "Physics Mechanics"}" with difficulty "${difficulty || "Medium"}".
      Return a clean JSON object containing a "questions" array.
      Do not wrap with markdown headers other than JSON.
      The structure must be:
      {
        "questions": [
          {
            "id": "gen_1",
            "question": "Question text?",
            "options": ["A", "B", "C", "D"],
            "correctAnswerIndex": 0,
            "explanation": "Brief explanation of correct answer"
          }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  },
                  required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
                }
              }
            },
            required: ["questions"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to generate exam questions." });
    }
  });

  // 3. AI Career Advisor (Skill gaps, custom roadmaps)
  app.post("/api/ai/career", async (req, res) => {
    const { targetRole, currentSkills } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        text: `### [Demo Mode] AI Career Advisor for ${targetRole || "Software Engineer"}:
        
        *   **Identified Skill Gaps**: Based on your skills (${currentSkills || "Basic Coding"}), you need to master Advanced System Architecture, Relational Databases, and Cloud Deployments.
        *   **Recommended Learning Path**:
            1.  Master React, TypeScript, and Tailwind.
            2.  Deepen Backend logic with Node.js/Express.
            3.  Learn Database Management (PostgreSQL, indexes).
            4.  Prepare for Cloud-Native deployments (Docker, Kubernetes).`
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Provide career advisor feedback for a student looking to become a "${targetRole}" with current skills: "${currentSkills}". Format response beautifully using markdown with 'Skill Gap Analysis', 'Custom Personalized Learning Roadmap', and 'Immediate actionable steps'.`
      });
      res.json({ text: response.text });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to generate career advice." });
    }
  });

  // 4. AI Translation System (Bengali to English & English to Bengali)
  app.post("/api/ai/translate", async (req, res) => {
    const { text, targetLanguage } = req.body; // e.g. "Bengali" or "English"
    const ai = getAI();

    if (!ai) {
      const isToBengali = targetLanguage === "Bengali";
      return res.json({
        text: isToBengali 
          ? `[Demo Mode] এডুভার্স এ আপনাকে স্বাগতম! (Welcome to EduVerse!)`
          : `[Demo Mode] Welcome to EduVerse Global Ecosystem!`
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Translate the following text into ${targetLanguage}: "${text}". Return only the translation without extra conversational words.`
      });
      res.json({ text: response.text?.trim() });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Translation failed." });
    }
  });

  // Vite Integration for Development & Build
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduVerse Server booted on http://localhost:${PORT}`);
  });
}

startServer();
