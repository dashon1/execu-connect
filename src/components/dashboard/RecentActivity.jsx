import React from 'react';
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Activity, User } from "lucide-react";
import { format } from "date-fns";

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-5 h-5 text-orange-500" />;
    case 'reviewed':
      return <AlertCircle className="w-5 h-5 text-blue-500" />;
    case 'accepted':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'rejected':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <FileText className="w-5 h-5 text-slate-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'reviewed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'accepted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export default function RecentActivity({ activities, userType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-1 shadow-xl"
    >
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          </div>
        </div>
        
        <div className="p-6">
          {activities.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20" />
                <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full">
                  <FileText className="w-16 h-16 text-blue-400" />
                </div>
              </div>
              <p className="text-slate-700 font-semibold text-lg mb-2">No recent activity</p>
              <p className="text-sm text-slate-500">
                {userType === 'executive' 
                  ? "Start applying to opportunities to see activity here"
                  : "Post opportunities or review applications to see activity here"
                }
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-slate-100 hover:border-blue-200 hover:shadow-md">
                    <div className="mt-1 p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      {activity.type === 'application' ? (
                        <User className="w-5 h-5 text-blue-600" />
                      ) : (
                        getStatusIcon(activity.status)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 mb-1">
                            {activity.title}
                          </p>
                          <p className="text-sm text-slate-600">
                            {activity.description}
                          </p>
                        </div>
                        
                        <Badge variant="secondary" className={`${getStatusColor(activity.status)} capitalize`}>
                          {activity.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {format(new Date(activity.date), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}