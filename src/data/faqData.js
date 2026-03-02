const faqData = [
  // ────────────────────────────────────────────────
  // QUIZ & EDUCATION SECTION
  // ────────────────────────────────────────────────
  {
    id: 1,
    category: "Quiz",
    question: "How do I start the quiz?",
    answer:
      "You must verify your email first. Once verified, you’ll be redirected to the quiz automatically.",
  },
  {
    id: 2,
    category: "Quiz",
    question: "Can I retake the quiz?",
    answer:
      "Currently, each verified email is allowed one quiz attempt to maintain fairness and accurate results. If you'd like to practice more, we plan to add unlimited practice mode in the future.",
  },
  {
    id: 9,
    category: "Quiz",
    question: "What grades and subjects are covered in the quizzes?",
    answer:
      "Our current quizzes focus on Grade 10–11 CAPS Mathematics (financial maths, algebra, trigonometry, inequalities). More subjects (Physical Sciences, Life Sciences) and grades are coming soon.",
  },
  {
    id: 10,
    category: "Quiz",
    question: "Do I get a certificate or results after the quiz?",
    answer:
      "Yes — after completing the quiz, you'll receive a detailed breakdown of your score, correct/incorrect answers with explanations, and a shareable results summary via email.",
  },
  {
    id: 11,
    category: "Quiz",
    question: "Why is there an email verification step for the quiz?",
    answer:
      "Email verification ensures one attempt per learner, prevents bot abuse, and allows us to send you personalised results and future learning recommendations.",
  },

  // ────────────────────────────────────────────────
  // EMAIL & ACCOUNT
  // ────────────────────────────────────────────────
  {
    id: 3,
    category: "Email",
    question: "I didn’t receive the verification email. What should I do?",
    answer:
      "Please check your spam or junk folder first. If you still don’t see it, return to the homepage and click the resend verification link. It usually arrives within 2 minutes.",
  },
  {
    id: 12,
    category: "Email",
    question: "Can I change my email address later?",
    answer:
      "Yes, once logged in you can update your email from your profile settings. A new verification will be required for security.",
  },

  // ────────────────────────────────────────────────
  // SECURITY & PRIVACY
  // ────────────────────────────────────────────────
  {
    id: 2,
    category: "Security",
    question: "Why do I need to verify my email?",
    answer:
      "Email verification prevents spam, ensures fairness, and allows you to receive your quiz results securely.",
  },
  {
    id: 13,
    category: "Security",
    question: "Is my data safe on SwiftMeta?",
    answer:
      "Yes — we use industry-standard encryption (HTTPS), secure JWT authentication, and we never sell your data. We comply with POPIA (Protection of Personal Information Act) requirements.",
  },

  // ────────────────────────────────────────────────
  // PRICING & BUSINESS / WEB DEVELOPMENT SERVICES
  // ────────────────────────────────────────────────
  {
    id: 5,
    category: "Pricing",
    question: "Why is creating a website more expensive than a mobile app?",
    answer:
      "A website often costs more because it must work across many screen sizes, browsers, and devices. It also requires SEO optimization, accessibility compliance, security hardening, and performance tuning. Mobile apps usually target a single platform at a time and rely on app stores for distribution.",
  },
  {
    id: 6,
    category: "Pricing",
    question: "What affects the cost of a website?",
    answer:
      "The cost depends on design complexity, number of pages, features (authentication, payments, dashboards), backend services, security requirements, hosting, and ongoing maintenance.",
  },
  {
    id: 7,
    category: "Pricing",
    question: "Is a website or mobile app better for my business?",
    answer:
      "It depends on your goals. Websites are ideal for visibility, SEO, and accessibility. Mobile apps are better for frequent users, offline access, and device features like notifications. Many businesses eventually need both.",
  },
  {
    id: 14,
    category: "Pricing",
    question: "Do you offer fixed-price packages or only custom quotes?",
    answer:
      "We offer both. Check our Services page for starter packages (e.g. Landing Page, Business Site, E-commerce). For complex projects (dashboards, AI integration, custom APIs), we provide detailed custom quotes after a free consultation.",
  },
  {
    id: 15,
    category: "Pricing",
    question: "What technologies do you use for websites?",
    answer:
      "We specialise in modern React + Next.js (App Router), Tailwind CSS, TypeScript, Node.js/Express or Supabase/Firebase backends, Vercel hosting, and responsive, SEO-friendly design. We also integrate AI features when needed.",
  },
  {
    id: 16,
    category: "Pricing",
    question: "Do you provide hosting and domain services?",
    answer:
      "Yes — we can handle domain registration, DNS setup, and high-performance hosting on Vercel or similar platforms. Hosting is usually included in the first year for most packages.",
  },
  {
    id: 17,
    category: "Pricing",
    question: "What happens during load-shedding or power outages in South Africa?",
    answer:
      "All our development and deployments are cloud-based. Your site stays online 24/7. We also build offline-capable PWAs (Progressive Web Apps) if your business needs resilience during outages.",
  },

  // ────────────────────────────────────────────────
  // SUPPORT & GENERAL
  // ────────────────────────────────────────────────
  {
    id: 8,
    category: "Support",
    question: "How do I contact support?",
    answer:
      "You can contact support by opening a ticket through the Help Center. Our team will respond via email within 24–48 hours (faster for urgent issues).",
  },
  {
    id: 18,
    category: "Support",
    question: "Do you offer maintenance packages after launch?",
    answer:
      "Yes — we provide monthly/annual maintenance plans that include updates, security patches, performance monitoring, backups, and minor content changes.",
  },
  {
    id: 19,
    category: "Support",
    question: "Can I see examples of websites you've built?",
    answer:
      "Absolutely! Visit our Portfolio section on the website or request case studies during your consultation. We’ve built e-commerce stores, educational platforms, business sites, and AI-integrated tools.",
  },
  {
    id: 20,
    category: "General",
    question: "Is SwiftMeta only for South African clients?",
    answer:
      "No — we serve clients locally (Johannesburg, Cape Town, Durban, etc.) and internationally. Pricing is in ZAR or USD depending on your preference.",
  },
];

export default faqData;
