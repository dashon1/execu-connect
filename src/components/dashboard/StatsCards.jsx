import React from 'react';
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle,
  TrendingUp,
  FileText,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export default function StatsCards({ userType, stats }) {
  const getStatsConfig = () => {
    if (userType === 'executive') {
      return [
        {
          title: "Total Applications",
          value: stats.totalApplications || 0,
          icon: FileText,
          gradient: "from-blue-500 via-blue-600 to-indigo-600",
          bgGradient: "from-blue-50 to-indigo-50",
          change: "+12%",
          positive: true
        },
        {
          title: "Active Opportunities",
          value: stats.activeOpportunities || 0,
          icon: Briefcase,
          gradient: "from-emerald-500 via-green-600 to-teal-600", 
          bgGradient: "from-emerald-50 to-teal-50",
          change: "+8%",
          positive: true
        },
        {
          title: "Pending Reviews",
          value: stats.pendingApplications || 0,
          icon: Clock,
          gradient: "from-orange-500 via-amber-600 to-yellow-600",
          bgGradient: "from-orange-50 to-yellow-50",
          change: "+3%",
          positive: true
        },
        {
          title: "Accepted",
          value: stats.acceptedApplications || 0,
          icon: CheckCircle,
          gradient: "from-purple-500 via-violet-600 to-indigo-600",
          bgGradient: "from-purple-50 to-indigo-50",
          change: "+24%",
          positive: true
        }
      ];
    } else {
      return [
        {
          title: "Posted Opportunities",
          value: stats.totalOpportunities || 0,
          icon: Briefcase,
          gradient: "from-blue-500 via-blue-600 to-indigo-600",
          bgGradient: "from-blue-50 to-indigo-50",
          change: "+15%",
          positive: true
        },
        {
          title: "Active Postings",
          value: stats.activeOpportunities || 0,
          icon: TrendingUp,
          gradient: "from-emerald-500 via-green-600 to-teal-600",
          bgGradient: "from-emerald-50 to-teal-50",
          change: "+10%",
          positive: true
        },
        {
          title: "Total Applications",
          value: stats.totalApplications || 0,
          icon: Users,
          gradient: "from-purple-500 via-violet-600 to-indigo-600",
          bgGradient: "from-purple-50 to-indigo-50",
          change: "+28%",
          positive: true
        },
        {
          title: "Pending Reviews",
          value: stats.pendingReviews || 0,
          icon: Clock,
          gradient: "from-orange-500 via-amber-600 to-yellow-600",
          bgGradient: "from-orange-50 to-yellow-50",
          change: "+5%",
          positive: true
        }
      ];
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {getStatsConfig().map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="group"
        >
          <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-1 shadow-lg hover:shadow-2xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
                    {stat.title}
                  </p>
                  <motion.p 
                    className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                
                <motion.div 
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${stat.positive ? 'bg-green-100' : 'bg-red-100'}`}>
                  {stat.positive ? (
                    <ArrowUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`text-xs font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <span className="text-xs text-slate-500">vs last month</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}