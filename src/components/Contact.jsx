import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ShieldCheck, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  History,
  Sparkles,
  ArrowRight,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Spin, Tooltip, Badge } from "antd";
import { api } from "../api";

/* ============================================
   SMART COMPONENTS
============================================ */

const ContactTimeline = ({ status }) => {
  const steps = [
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'received', label: 'Received', icon: CheckCircle2 },
    { id: 'reviewing', label: 'Reviewing', icon: Clock },
    { id: 'replied', label: 'Replied', icon: Mail },
  ];

  const currentStep = steps.findIndex(s => s.id === status);
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full py-4">
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full -translate-y-1/2" />
        
        {/* Progress Line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, idx) => {
            const isActive = idx <= currentStep;
            const isCurrent = idx === currentStep;
            
            return (
              <motion.div 
                key={step.id}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-blue-500/20 scale-110' : ''}`}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <step.icon size={14} />
                </motion.div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const configs = {
    pending: {
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      icon: Clock,
      label: 'Pending Review',
      pulse: true
    },
    approved: {
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      icon: CheckCircle2,
      label: 'Replied',
      pulse: false
    },
    sending: {
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      icon: Loader2,
      label: 'Sending...',
      pulse: true
    }
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <Tooltip title={status === 'approved' ? "Check your email for our response" : "We're reviewing your message"}>
      <motion.div 
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${config.color}`}
        animate={config.pulse ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Icon size={14} className={config.pulse ? 'animate-spin' : ''} />
        {config.label}
      </motion.div>
    </Tooltip>
  );
};

const ContactCard = ({ item, isExpanded, onToggle }) => {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(item._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        item.status === 'approved' 
          ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800' 
          : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Header - Always Visible */}
      <div 
        onClick={onToggle}
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              item.status === 'approved' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600' 
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
            }`}>
              <MessageSquare size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                {item.subject || "No Subject"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(item.createdAt).toLocaleDateString()} • {item.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="text-gray-400"
            >
              <ChevronDown size={20} />
            </motion.div>
          </div>
        </div>

        {/* Mini Timeline Preview */}
        {!isExpanded && <ContactTimeline status={item.status} />}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 space-y-4">
              {/* Full Timeline */}
              <div className="bg-white dark:bg-gray-900/50 rounded-xl p-4">
                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Message Progress
                </h5>
                <ContactTimeline status={item.status} />
              </div>

              {/* Message Preview */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Your Message
                  </h5>
                  <span className="text-xs text-gray-400">
                    {item.message?.length || 0} characters
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {item.message}
                </p>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="font-mono">ID: {item._id.slice(-8)}</span>
                  <button
                    onClick={copyId}
                    className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy ID"}
                  </button>
                </div>
                <span>Via: {item.email}</span>
              </div>

              {/* Reply Notice */}
              {item.status === 'approved' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-start gap-2"
                >
                  <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Response Sent
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                      We've replied to your message. Please check your email inbox and spam folder.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ============================================
   MAIN COMPONENT
============================================ */

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const LIMIT = 4;

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    calculateProgress({ ...form, [field]: value });
  };

  const calculateProgress = (data) => {
    const fields = ['name', 'email', 'message'];
    const filled = fields.filter(f => data[f]?.trim().length > 0).length;
    setFormProgress((filled / fields.length) * 100);
  };

  // Fetch contact history
  const fetchHistory = async (reset = false) => {
    try {
      setFetching(true);
      const { data } = await api.get(`/contact?skip=${reset ? 0 : skip}&limit=${LIMIT}`);
      if (reset) {
        setHistory(data);
        setSkip(LIMIT);
      } else {
        setHistory(prev => [...prev, ...data]);
        setSkip(prev => prev + LIMIT);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchHistory(true);
  }, []);

  // Submit form
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    
    if (!form.name || !form.email || !form.message) {
      return setError("Please fill in all required fields.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return setError("Please enter a valid email address.");
    }

    try {
      setLoading(true);
      await api.post("/contact", form);
      setForm({ name: "", email: "", subject: "", message: "" });
      setFormProgress(0);
      fetchHistory(true);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Skeleton loader
  const SkeletonItem = () => (
    <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 animate-pulse" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 py-12 px-4 sm:px-6">
      <Helmet>
        <title>Contact Us | SwiftMeta</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <Sparkles size={16} />
            <span>We're here to help</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Have a question or idea? We'd love to hear from you.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <Badge 
              count={<Clock size={14} />} 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <span className="text-gray-600 dark:text-gray-300">Replies within 24h</span>
            </Badge>
            <Badge 
              count={<ShieldCheck size={14} />} 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <span className="text-gray-600 dark:text-gray-300">Secure & encrypted</span>
            </Badge>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Info Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            <InfoCard 
              icon={Mail} 
              title="Email Us" 
              value="Famacloud.ai@gmail.com"
              action="mailto:Famacloud.ai@gmail.com"
            />
            <InfoCard 
              icon={Phone} 
              title="Call or WhatsApp" 
              value="+27 63 441 4863"
              secondary="+27 65 393 5339"
              action="https://wa.me/27634414863"
            />
            <InfoCard 
              icon={MapPin} 
              title="Visit Us" 
              value="Johannesburg South"
              secondary="South Africa"
            />
            
            {/* Quick Stats */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <History size={18} />
                Response Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Avg. Response Time</span>
                  <span className="font-bold">4 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Satisfaction Rate</span>
                  <span className="font-bold">98%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Messages Today</span>
                  <span className="font-bold">{history.length}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Form Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Send Message
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${formProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(formProgress)}%</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SmartInput 
                    label="Full Name *" 
                    value={form.name} 
                    onChange={v => updateField("name", v)}
                    icon={User}
                    placeholder="John Doe"
                  />
                  <SmartInput 
                    label="Email Address *" 
                    type="email"
                    value={form.email} 
                    onChange={v => updateField("email", v)}
                    icon={Mail}
                    placeholder="john@example.com"
                  />
                </div>

                <SmartInput 
                  label="Subject" 
                  value={form.subject} 
                  onChange={v => updateField("subject", v)}
                  icon={MessageSquare}
                  placeholder="What's this about?"
                />

                <SmartTextarea 
                  label="Message *" 
                  value={form.message} 
                  onChange={v => updateField("message", v)}
                  placeholder="Tell us more about your project or question..."
                />

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3"
                    >
                      <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={loading || formProgress < 100}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    formProgress === 100
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* History Section */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <History size={20} />
                  Your Messages
                </h3>
                <Badge 
                  count={history.length} 
                  className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm"
                />
              </div>

              <div className="space-y-3">
                {fetching && history.length === 0 ? (
                  Array(3).fill(0).map((_, idx) => <SkeletonItem key={idx} />)
                ) : history.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <MessageSquare className="text-gray-400" size={24} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                    <p className="text-sm text-gray-400 mt-1">Your contact history will appear here</p>
                  </div>
                ) : (
                  history.map(item => (
                    <ContactCard
                      key={item._id}
                      item={item}
                      isExpanded={expandedId === item._id}
                      onToggle={() => setExpandedId(expandedId === item._id ? null : item._id)}
                    />
                  ))
                )}
              </div>

              {/* Load More */}
              {history.length > 0 && history.length % LIMIT === 0 && (
                <div className="flex justify-center mt-6">
                  <motion.button
                    onClick={() => fetchHistory(false)}
                    disabled={fetching}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 transition-colors"
                  >
                    {fetching ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        Load More
                        <ChevronDown size={16} />
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

/* ============================================
   HELPER COMPONENTS
============================================ */

function InfoCard({ icon: Icon, title, value, secondary, action }) {
  const content = (
    <div className="group p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
          <Icon size={22} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{value}</p>
          {secondary && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{secondary}</p>
          )}
        </div>
        {action && (
          <ArrowRight className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={18} />
        )}
      </div>
    </div>
  );

  if (action) {
    return (
      <a href={action} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}

function SmartInput({ label, type = "text", value, onChange, icon: Icon, placeholder }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className={`relative flex items-center transition-all duration-300 ${
        isFocused ? 'transform scale-[1.02]' : ''
      }`}>
        {Icon && (
          <div className={`absolute left-4 transition-colors duration-300 ${
            isFocused ? 'text-blue-500' : 'text-gray-400'
          }`}>
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

function SmartTextarea({ label, value, onChange, placeholder }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <textarea
          rows={5}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 ${
            isFocused ? 'transform scale-[1.01]' : ''
          }`}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {value.length} chars
        </div>
      </div>
    </div>
  );
}
