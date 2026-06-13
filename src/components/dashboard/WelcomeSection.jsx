import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Settings, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function WelcomeSection({ user, profile }) {
  const getWelcomeMessage = () => {
    if (user.user_type === 'executive') {
      return profile 
        ? "Ready to find your next fractional opportunity?"
        : "Complete your executive profile to start receiving opportunities";
    } else {
      return profile
        ? "Find the perfect fractional executive for your startup"
        : "Set up your startup profile to begin posting opportunities";
    }
  };

  const getActionButton = () => {
    if (!profile) {
      return (
        <Link to={createPageUrl("Profile")}>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <Settings className="w-5 h-5 mr-2" />
            Complete Profile
          </Button>
        </Link>
      );
    }

    if (user.user_type === 'executive') {
      return (
        <Link to={createPageUrl("Opportunities")}>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            Browse Opportunities
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      );
    } else {
      return (
        <Link to={createPageUrl("Executives")}>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            Find Executives
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-1 shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      <div className="relative bg-white/95 backdrop-blur-sm rounded-xl p-8 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Welcome back, {user.full_name?.split(' ')[0] || 'User'}!
              </h1>
            </div>
            <p className="text-slate-700 text-lg md:text-xl font-medium">
              {getWelcomeMessage()}
            </p>
          </div>
          
          {getActionButton()}
        </div>
      </div>
    </motion.div>
  );
}