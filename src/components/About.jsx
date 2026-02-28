import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { 
  Code, 
  Layers, 
  Zap, 
  Globe, 
  Calculator, 
  Atom, 
  FunctionSquare, 
  FlaskConical,
  Brain,
  Sparkles,
  ChevronRight,
  BookOpen
} from "lucide-react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-950 dark:to-black px-6 py-12 pt-16 overflow-hidden">
      <Helmet>
        <title>About SwiftMeta | Developer Tools & STEM Education</title>
        <meta
          name="description"
          content="SwiftMeta builds modern developer tools, AI-powered STEM learning platforms, and applications focused on productivity, software architecture, mathematics, and science education."
        />
      </Helmet>

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Hero Header */}
        <header className={`mb-12 transition-all pt-16 duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-sky-500 animate-spin-slow" />
            <span className="text-sm font-medium text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              Innovation Meets Education
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-600">SwiftMeta</span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Building intelligent developer platforms and <strong>AI-powered STEM education tools</strong> 
            that transform how we learn mathematics, science, and software engineering.
          </p>
        </header>

        {/* Mission Statement */}
        <section className={`mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative bg-white dark:bg-white/5 rounded-3xl p-8 md:p-10 shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-8 h-8 text-purple-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              </div>
              
              <p className="text-lg text-gray-800 dark:text-gray-300 leading-relaxed mb-4">
                <strong>SwiftMeta</strong> bridges the gap between complex concepts and intuitive understanding. 
                We combine cutting-edge AI with pedagogical excellence to create tools that don't just teach — 
                they inspire discovery in mathematics, physics, chemistry, and computer science.
              </p>

              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                From solving differential equations to debugging distributed systems, our platforms adapt to 
                your learning style, providing step-by-step reasoning, visualizations, and real-world applications.
              </p>
            </div>
          </div>
        </section>

        {/* STEM Education Section - NEW */}
        <section className={`mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Calculator className="w-8 h-8 text-sky-500" />
                STEM Intelligence
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                AI-powered tutoring for mathematics and sciences
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <span className="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full text-sm font-medium">
                Calculus
              </span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                Physics
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                Chemistry
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StemCard
              icon={FunctionSquare}
              title="Advanced Mathematics"
              description="From algebra to differential equations. Interactive problem solving with symbolic computation, graph plotting, and proof assistance."
              features={["Step-by-step solutions", "LaTeX rendering", "Graph visualization", "Error analysis"]}
              color="sky"
              delay={400}
            />
            <StemCard
              icon={Atom}
              title="Physics & Chemistry"
              description="Understand fundamental forces and molecular interactions. Virtual labs, equation solvers, and conceptual explanations powered by AI."
              features={["Unit conversion", "Formula derivation", "Simulation models", "Lab report help"]}
              color="purple"
              delay={500}
            />
            <StemCard
              icon={FlaskConical}
              title="Scientific Computing"
              description="Bridge theory and application with Python, MATLAB, and Julia integrations. Data analysis, statistical modeling, and numerical methods."
              features={["Code generation", "Data visualization", "Statistical analysis", "Research tools"]}
              color="green"
              delay={600}
            />
            <StemCard
              icon={BookOpen}
              title="Adaptive Learning"
              description="Personalized curricula that identify knowledge gaps and adjust difficulty. Spaced repetition and mastery-based progression."
              features={["Knowledge mapping", "Progress tracking", "Smart quizzes", "Study plans"]}
              color="orange"
              delay={700}
            />
          </div>
        </section>

        {/* What we build */}
        <section className={`mb-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <Layers className="w-8 h-8 text-sky-500" />
            Engineering Excellence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Feature
              icon={Code}
              title="Developer Platforms"
              text="Educational platforms that explain real-world patterns, from system design to algorithmic thinking, with interactive code environments."
              delay={500}
            />
            <Feature
              icon={Zap}
              title="AI-Native Tools"
              text="Intelligent coding assistants and automated workflows that understand context, not just syntax. Built with modern LLM architectures."
              delay={600}
            />
            <Feature
              icon={Globe}
              title="Scalable Architectures"
              text="Production-ready systems focusing on microservices, event-driven design, and cloud-native patterns that scale from prototype to enterprise."
              delay={700}
            />
            <Feature
              icon={Brain}
              title="Cognitive Interfaces"
              text="Natural language interactions for complex technical tasks. Making advanced computation accessible through conversational AI."
              delay={800}
            />
          </div>
        </section>

        {/* Philosophy */}
        <section className={`mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white/10 dark:to-white/5 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <h2 className="text-3xl font-bold mb-6 relative z-10">Engineering Philosophy</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {[
                "First principles over frameworks",
                "Clarity beats cleverness",
                "Education through experimentation",
                "Tools that scale with cognition",
                "Open knowledge, open source",
                "Measure twice, automate once"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 group cursor-default">
                  <ChevronRight className="w-5 h-5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                  <span className="text-gray-200 dark:text-gray-300 group-hover:text-white transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section className={`mb-16 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="border border-sky-500/20 rounded-3xl p-8 bg-sky-50/50 dark:bg-sky-900/10 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              SwiftMeta Ecosystem
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
              An integrated suite of tools spanning software development and STEM education. 
              From coding bootcamps to calculus tutoring, we build the infrastructure for modern learning.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://swiftmeta.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg"
              >
                Explore Platform
                <ChevronRight className="w-4 h-4" />
              </a>
              
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-white/20 transition-all">
                View Documentation
              </button>
            </div>
          </div>
        </section>

        {/* Stats or Metrics */}
        <section className={`mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "STEM Topics", value: "50+" },
              { label: "Code Examples", value: "10k+" },
              { label: "AI Interactions", value: "1M+" },
              { label: "Learning Paths", value: "24" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-black text-sky-600 dark:text-sky-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-gray-200 dark:border-white/10">
          <p className="text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} SwiftMeta. Engineering the future of education.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-sky-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-sky-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-sky-500 transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Feature({ icon: Icon, title, text, delay }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`group bg-white dark:bg-white/5 rounded-2xl p-6 border border-black/5 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-900/30 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
          <Icon className="w-6 h-6 text-sky-600 dark:text-sky-400 group-hover:text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function StemCard({ icon: Icon, title, description, features, color, delay }) {
  const [isVisible, setIsVisible] = useState(false);
  
  const colors = {
    sky: "from-sky-500 to-blue-600 bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800",
    purple: "from-purple-500 to-violet-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    green: "from-green-500 to-emerald-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    orange: "from-orange-500 to-red-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`group relative overflow-hidden rounded-2xl border ${colors[color]} transition-all duration-700 hover:shadow-2xl hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`w-10 h-10 text-${color}-600 dark:text-${color}-400`} />
          <div className="flex gap-1">
            {features.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full bg-${color}-500`} />
            ))}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-current group-hover:to-current transition-all">
          {title}
        </h3>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {features.map((feature, idx) => (
            <span 
              key={idx} 
              className={`px-2 py-1 bg-white/50 dark:bg-black/20 rounded-md text-xs font-medium text-${color}-700 dark:text-${color}-300 border border-${color}-200 dark:border-${color}-800`}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
