import React, { useState, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  Server,
  Code,
  Shield,
  Globe,
  FileCode,
  Terminal,
  Copy,
  Zap,
  Database,
  Layers,
  BookOpen,
  Play,
  CheckCircle,
  AlertTriangle,
  Key,
  Webhook,
  Cloud,
  Lock,
  ArrowRight,
  RefreshCw,
  Box,
  Cpu,
  Settings,
  ExternalLink
} from "lucide-react";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }, [text]);

  return (
    <button
      onClick={onCopy}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 transition-colors"
    >
      <Copy size={14} />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({ children, language = "javascript", filename = "" }) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-[#1e1e1e]">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="ml-3 text-xs text-gray-400 font-mono">{filename}</span>
          </div>
          <CopyButton text={children} />
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="font-mono text-gray-100">{children}</code>
      </pre>
    </div>
  );
}

function StepCard({ number, title, description, icon: Icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
        isActive 
          ? "bg-sky-50 dark:bg-sky-900/20 border-sky-500 shadow-md" 
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isActive ? "bg-sky-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
        }`}>
          {number ? <span className="font-bold text-sm">{number}</span> : <Icon size={18} />}
        </div>
        <div>
          <h4 className={`font-semibold ${isActive ? "text-sky-900 dark:text-sky-100" : "text-gray-900 dark:text-white"}`}>
            {title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
    </button>
  );
}

export default function ServerAPI() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeStep, setActiveStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Comprehensive code examples
  const examples = {
    basicFetch: `// 1. Basic Fetch API in React
import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api.example.com/users")
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
}`,

    asyncAwait: `// 2. Modern Async/Await with Error Handling
import { useEffect, useState } from "react";

async function fetchWithAuth(url, token) {
  const response = await fetch(url, {
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  return response.json();
}

// Usage in component
function Dashboard() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchWithAuth('/api/dashboard', localStorage.getItem('token'));
        setData(result);
      } catch (error) {
        console.error('Failed to load:', error);
      }
    };
    
    loadData();
  }, []);
}`,

    expressBasic: `// 3. Basic Express.js API Server
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/users', async (req, res) => {
  try {
    // Database query here
    const users = await db.query('SELECT * FROM users LIMIT 100');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,

    crudOperations: `// 4. Complete CRUD API with Validation
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

const router = Router();

// CREATE - POST /api/users
router.post('/users',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().isLength({ min: 2 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, name } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        createdAt: new Date()
      });
      
      res.status(201).json({ 
        success: true, 
        data: { id: user.id, email: user.email, name: user.name }
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      throw error;
    }
  }
);

// READ - GET /api/users/:id
router.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, data: user });
});

// UPDATE - PUT /api/users/:id
router.put('/users/:id', async (req, res) => {
  const updates = req.body;
  delete updates.password; // Prevent password update here
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );
  
  res.json({ success: true, data: user });
});

// DELETE - DELETE /api/users/:id
router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;`,

    jwtAuth: `// 5. JWT Authentication Implementation
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

// Generate token
const generateToken = (userId) => {
  return jwt.sign(
    { userId, iat: Math.floor(Date.now() / 1000) },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN, algorithm: 'HS256' }
  );
};

// Middleware to verify token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = generateToken(user.id);
  res.json({
    success: true,
    data: {
      token,
      user: { id: user.id, email: user.email, name: user.name }
    }
  });
});

// Protected route example
app.get('/api/profile', authenticateToken, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json({ success: true, data: user });
});`,

    databaseSetup: `// 6. Database Connection & Models (Prisma + PostgreSQL)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Connection handling
async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Usage in API routes
app.get('/api/posts', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true, email: true }
      },
      comments: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  
  res.json({ success: true, data: posts });
});

// Schema definition (schema.prisma)
/*
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String     @id @default(uuid())
  title     String
  content   String
  published Boolean    @default(false)
  author    User       @relation(fields: [authorId], references: [id])
  authorId  String
  comments  Comment[]
}

model Comment {
  id     String @id @default(uuid())
  text   String
  post   Post   @relation(fields: [postId], references: [id])
  postId String
}
*/`,

    deployment: `# 7. Deployment with Docker & Docker Compose

# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
USER node
CMD ["node", "server.js"]

# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
      - JWT_SECRET=\${JWT_SECRET}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:`,

    testing: `// 8. API Testing with Jest & Supertest
import request from 'supertest';
import app from '../app';
import { prisma } from '../db';

describe('User API', () => {
  beforeAll(async () => {
    // Setup test database
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          password: 'securePassword123',
          name: 'Test User'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'invalid-email',
          password: 'securePassword123',
          name: 'Test'
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      // Create test user first
      const user = await prisma.user.create({
        data: {
          email: 'find@example.com',
          password: 'hashed',
          name: 'Find Me'
        }
      });

      const response = await request(app)
        .get(\`/api/users/\${user.id}\`)
        .expect(200);

      expect(response.body.data.name).toBe('Find Me');
    });
  });
});`
  };

  const steps = [
    {
      title: "Project Setup",
      description: "Initialize Node.js project with Express and essential middleware",
      code: examples.expressBasic,
      filename: "server.js"
    },
    {
      title: "Database Connection",
      description: "Connect to PostgreSQL with Prisma ORM for type-safe queries",
      code: examples.databaseSetup,
      filename: "database.js / schema.prisma"
    },
    {
      title: "CRUD Operations",
      description: "Create RESTful endpoints with validation and error handling",
      code: examples.crudOperations,
      filename: "routes/users.js"
    },
    {
      title: "Authentication",
      description: "Implement JWT-based auth with secure password hashing",
      code: examples.jwtAuth,
      filename: "auth.js"
    },
    {
      title: "Frontend Integration",
      description: "Connect React frontend with proper error handling",
      code: examples.asyncAwait,
      filename: "Dashboard.jsx"
    },
    {
      title: "Testing & Deployment",
      description: "Write tests and deploy with Docker",
      code: examples.testing,
      filename: "users.test.js"
    }
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: Globe },
    { id: "tutorial", label: "Step-by-Step", icon: BookOpen },
    { id: "examples", label: "Code Examples", icon: Code },
    { id: "security", label: "Security", icon: Shield },
    { id: "deployment", label: "Deployment", icon: Cloud },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Complete API Development Guide | SwiftMeta</title>
        <meta name="description" content="Learn to build production-ready APIs with Node.js, Express, React, and modern best practices." />
      </Helmet>

      <div className="max-w-7xl mx-auto pt-16 space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur">
                <Server size={32} className="text-sky-400" />
              </div>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-sky-300 border border-white/10">
                Complete Guide
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Build Production-Ready APIs
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
              Master modern API development with Node.js, Express, and React. 
              From basic CRUD to authentication, testing, and deployment.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar for Tutorial Steps */}
          {activeTab === "tutorial" && (
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">
                Tutorial Steps
              </h3>
              {steps.map((step, idx) => (
                <StepCard
                  key={idx}
                  number={idx + 1}
                  title={step.title}
                  description={step.description}
                  isActive={activeStep === idx}
                  onClick={() => setActiveStep(idx)}
                />
              ))}
            </div>
          )}

          {/* Main Content */}
          <div className={`${activeTab === "tutorial" ? "lg:col-span-8" : "lg:col-span-12"}`}>
            
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                      <Database className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">RESTful Design</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Learn proper HTTP methods, status codes, and resource naming conventions for intuitive APIs.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                      <Lock className="text-green-600 dark:text-green-400" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Security First</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Implement JWT auth, input validation, rate limiting, and protection against common vulnerabilities.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                      <Zap className="text-purple-600 dark:text-purple-400" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Database indexing, caching strategies, and connection pooling for high-traffic applications.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Layers size={20} />
                      API Architecture Stack
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center font-bold text-green-700 dark:text-green-400">N</div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Node.js</p>
                          <p className="text-gray-500">Runtime</p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 hidden sm:block" />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-700 dark:text-gray-400">Ex</div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Express</p>
                          <p className="text-gray-500">Framework</p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 hidden sm:block" />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-700 dark:text-blue-400">Pr</div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Prisma</p>
                          <p className="text-gray-500">ORM</p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 hidden sm:block" />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-400">Pg</div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">PostgreSQL</p>
                          <p className="text-gray-500">Database</p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 hidden sm:block" />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center font-bold text-sky-700 dark:text-sky-400">R</div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">React</p>
                          <p className="text-gray-500">Frontend</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tutorial Tab */}
            {activeTab === "tutorial" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Step {activeStep + 1}: {steps[activeStep].title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {steps[activeStep].description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                      disabled={activeStep === 0}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                      disabled={activeStep === steps.length - 1}
                      className="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-sm font-medium disabled:opacity-50 hover:bg-sky-600 transition-colors"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <CodeBlock filename={steps[activeStep].filename}>
                    {steps[activeStep].code}
                  </CodeBlock>
                </div>
              </div>
            )}

            {/* Examples Tab */}
            {activeTab === "examples" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <RefreshCw size={16} />
                        Basic Fetch
                      </h4>
                    </div>
                    <div className="p-4">
                      <CodeBlock>{examples.basicFetch}</CodeBlock>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Key size={16} />
                        JWT Authentication
                      </h4>
                    </div>
                    <div className="p-4">
                      <CodeBlock>{examples.jwtAuth}</CodeBlock>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Terminal size={16} />
                      Docker Deployment
                    </h4>
                    <CopyButton text={examples.deployment} />
                  </div>
                  <div className="p-4">
                    <CodeBlock filename="docker-compose.yml">{examples.deployment}</CodeBlock>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">OWASP API Security Top 10</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                        APIs are uniquely vulnerable. Review these critical risks before deploying to production.
                      </p>
                      <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                        <li className="flex items-center gap-2"><CheckCircle size={14} /> Broken Object Level Authorization</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} /> Broken Authentication</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} /> Excessive Data Exposure</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} /> Lack of Resources & Rate Limiting</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} /> Broken Function Level Authorization</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Shield size={18} className="text-green-600" />
                      Security Checklist
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={12} className="text-green-600" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">HTTPS everywhere with valid TLS certificates</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={12} className="text-green-600" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">JWT tokens with short expiration (15-30 min)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={12} className="text-green-600" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">Rate limiting per IP and per user</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={12} className="text-green-600" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">Input validation on all endpoints</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={12} className="text-green-600" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">CORS properly configured, not wildcard</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Webhook size={18} className="text-blue-600" />
                      Headers to Set
                    </h4>
                    <div className="space-y-2 font-mono text-xs">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <span className="text-purple-600 dark:text-purple-400">X-Content-Type-Options:</span> nosniff
                      </div>
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <span className="text-purple-600 dark:text-purple-400">X-Frame-Options:</span> DENY
                      </div>
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <span className="text-purple-600 dark:text-purple-400">Strict-Transport-Security:</span> max-age=31536000
                      </div>
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <span className="text-purple-600 dark:text-purple-400">X-RateLimit-Limit:</span> 100
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Deployment Tab */}
            {activeTab === "deployment" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Box size={20} />
                      Docker Deployment
                    </h3>
                  </div>
                  <div className="p-6">
                    <CodeBlock filename="docker-compose.yml">{examples.deployment}</CodeBlock>
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                        <Play size={16} />
                        Quick Start Commands
                      </h4>
                      <div className="space-y-2 font-mono text-sm text-blue-800 dark:text-blue-200">
                        <p>docker-compose up -d</p>
                        <p>npx prisma migrate dev</p>
                        <p>npm run seed</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a href="#" className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <Cloud className="text-orange-500 mb-3" size={32} />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AWS ECS</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Deploy to Elastic Container Service with auto-scaling</p>
                    <ExternalLink size={16} className="mt-3 text-gray-400 group-hover:text-gray-600" />
                  </a>
                  
                  <a href="#" className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <Cpu className="text-blue-500 mb-3" size={32} />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Google Cloud Run</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Serverless containers with pay-per-use pricing</p>
                    <ExternalLink size={16} className="mt-3 text-gray-400 group-hover:text-gray-600" />
                  </a>
                  
                  <a href="#" className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <Settings className="text-purple-500 mb-3" size={32} />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Railway/Render</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Zero-config deployment from GitHub</p>
                    <ExternalLink size={16} className="mt-3 text-gray-400 group-hover:text-gray-600" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
