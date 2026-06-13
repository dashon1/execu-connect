import React from "react";
import { motion } from "framer-motion";
import { 
  Search, Users, MessageSquare, Calendar, Shield, Award,
  TrendingUp, FileText, Zap, Globe, Clock, CheckCircle,
  BarChart3, Video, Star, Briefcase, Target, DollarSign,
  Bell, Filter, Lock, Sparkles, GitBranch, Database, Brain
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Smart algorithm matches executives with opportunities based on skills, experience, and preferences",
      category: "Intelligent Matching"
    },
    {
      icon: Search,
      title: "Advanced Search & Filters",
      description: "Find exactly what you need with powerful search and filtering by specialization, industry, and more",
      category: "Discovery"
    },
    {
      icon: Users,
      title: "Verified Executive Profiles",
      description: "Detailed profiles with verified credentials, achievements, and past engagements",
      category: "Trust & Safety"
    },
    {
      icon: MessageSquare,
      title: "In-App Messaging",
      description: "Secure, real-time communication between startups and executives",
      category: "Communication"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Integrated calendar for interviews, meetings, and milestone tracking",
      category: "Productivity"
    },
    {
      icon: Shield,
      title: "Background Verification",
      description: "Comprehensive background checks and credential verification for peace of mind",
      category: "Trust & Safety"
    },
    {
      icon: Award,
      title: "Endorsements & Reviews",
      description: "Peer endorsements and client reviews to build trust and credibility",
      category: "Social Proof"
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Real-time insights on applications, engagement, and market trends",
      category: "Analytics"
    },
    {
      icon: FileText,
      title: "Contract Templates",
      description: "Pre-built, legally vetted contract templates for various engagement types",
      category: "Legal"
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Real-time alerts for new opportunities, applications, and messages",
      category: "Communication"
    },
    {
      icon: Globe,
      title: "Global Talent Pool",
      description: "Access to executives worldwide with expertise across all industries",
      category: "Network"
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Built-in time tracking for hourly engagements and project milestones",
      category: "Project Management"
    },
    {
      icon: CheckCircle,
      title: "Milestone Management",
      description: "Set and track project milestones with automated progress updates",
      category: "Project Management"
    },
    {
      icon: BarChart3,
      title: "Performance Metrics",
      description: "Track success rates, completion times, and satisfaction scores",
      category: "Analytics"
    },
    {
      icon: Video,
      title: "Video Introductions",
      description: "Upload video profiles to showcase personality and communication skills",
      category: "Profiles"
    },
    {
      icon: Star,
      title: "Featured Listings",
      description: "Boost visibility with premium featured opportunities and profiles",
      category: "Marketing"
    },
    {
      icon: Briefcase,
      title: "Portfolio Showcase",
      description: "Display past work, case studies, and measurable results",
      category: "Profiles"
    },
    {
      icon: Target,
      title: "Goal Setting & Tracking",
      description: "Set engagement goals and track progress with visual dashboards",
      category: "Productivity"
    },
    {
      icon: DollarSign,
      title: "Secure Payments",
      description: "Integrated payment processing with escrow protection and invoicing",
      category: "Finance"
    },
    {
      icon: Bell,
      title: "Custom Alerts",
      description: "Set custom notifications for opportunities matching your criteria",
      category: "Communication"
    },
    {
      icon: Filter,
      title: "Saved Searches",
      description: "Save your search criteria and get notified of new matches",
      category: "Discovery"
    },
    {
      icon: Lock,
      title: "Privacy Controls",
      description: "Granular control over profile visibility and data sharing",
      category: "Trust & Safety"
    },
    {
      icon: Sparkles,
      title: "Success Stories",
      description: "Learn from successful engagements with detailed case studies",
      category: "Resources"
    },
    {
      icon: GitBranch,
      title: "Team Collaboration",
      description: "Invite team members and manage approvals with role-based access",
      category: "Collaboration"
    },
    {
      icon: Database,
      title: "Data Export",
      description: "Export your data, reports, and analytics in multiple formats",
      category: "Analytics"
    }
  ];

  const categories = [...new Set(features.map(f => f.category))];

  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-green-600",
    "from-amber-500 to-orange-600"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-20 px-4">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold">25+ Premium Features</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Connect & Succeed
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              ExecutiveConnect provides a comprehensive suite of tools designed to help startups 
              find exceptional fractional executives and help executives find their next opportunity.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradients[index % gradients.length]} p-1 shadow-lg hover:shadow-2xl transition-all duration-300`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative bg-white rounded-xl p-6 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div 
                      className={`p-3 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} shadow-lg`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-2">
                        {feature.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
            Feature Categories
          </h2>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className={`px-6 py-3 rounded-full bg-gradient-to-r ${gradients[index % gradients.length]} text-white font-semibold shadow-lg cursor-pointer`}
              >
                {category}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          
          <div className="relative text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of startups and executives already using ExecutiveConnect
            </p>
            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              Start Your Journey Today
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}