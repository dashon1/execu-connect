import React from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  User, 
  Search, 
  Plus, 
  FileText, 
  Users,
  Briefcase,
  Settings,
  ArrowRight,
  Zap,
  UserCheck,
  Eye
} from "lucide-react";

export default function QuickActions({ userType, hasProfile }) {
  const getActions = () => {
    if (!hasProfile) {
      return [
        {
          title: "Complete Profile",
          description: "Set up your profile to get started",
          icon: Settings,
          page: "Profile",
          gradient: "from-blue-500 via-blue-600 to-indigo-600"
        }
      ];
    }

    if (userType === 'executive') {
      return [
        {
          title: "Browse Opportunities",
          description: "Find your next role",
          icon: Search,
          page: "Opportunities",
          gradient: "from-blue-500 via-blue-600 to-indigo-600"
        },
        {
          title: "My Applications",
          description: "Track your applications",
          icon: FileText,
          page: "MyApplications",
          gradient: "from-purple-500 via-violet-600 to-indigo-600"
        },
        {
          title: "Update Profile",
          description: "Keep your profile current",
          icon: User,
          page: "Profile",
          gradient: "from-emerald-500 via-green-600 to-teal-600"
        }
      ];
    } else {
      return [
        {
          title: "Post Opportunity",
          description: "Find your next executive",
          icon: Plus,
          page: "PostOpportunity",
          gradient: "from-blue-500 via-blue-600 to-indigo-600"
        },
        {
          title: "Browse Executives",
          description: "Find experienced leaders",
          icon: Users,
          page: "Executives",
          gradient: "from-purple-500 via-violet-600 to-indigo-600"
        },
        {
          title: "My Opportunities",
          description: "Manage your postings",
          icon: Briefcase,
          page: "MyOpportunities",
          gradient: "from-emerald-500 via-green-600 to-teal-600"
        }
      ];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-1 shadow-xl"
    >
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Quick Actions</h3>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {getActions().map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <Link to={createPageUrl(action.page)}>
                <div className="relative group overflow-hidden rounded-xl">
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative p-4 bg-gradient-to-br from-white to-slate-50 border-2 border-slate-100 group-hover:border-transparent rounded-xl transition-all duration-300 group-hover:shadow-lg">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <action.icon className="w-5 h-5 text-white" />
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                          {action.title}
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}