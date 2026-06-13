import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Clock,
  ArrowRight,
  Star,
  MapPin,
  DollarSign
} from "lucide-react";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import StatsCards from "../components/dashboard/StatsCards";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      if (userData.user_type === 'executive') {
        await loadExecutiveDashboard(userData);
      } else if (userData.user_type === 'startup') {
        await loadStartupDashboard(userData);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setLoading(false);
  }, []); // Empty dependency array as it only depends on functions defined outside or stable references

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]); // Dependency array now includes loadDashboardData

  const loadExecutiveDashboard = async (userData) => {
    try {
      const executiveProfiles = await base44.entities.Executive.list();
      const executiveProfile = executiveProfiles.find(e => e.user_id === userData.id);
      setProfile(executiveProfile);

      const allApplications = await base44.entities.Application.list();
      const opportunities = await base44.entities.Opportunity.list();

      if (executiveProfile) {
        const applications = allApplications.filter(app => app.executive_id === executiveProfile.id);
        
        setStats({
          totalApplications: applications.length,
          activeOpportunities: opportunities.filter(op => op.status === 'active').length,
          pendingApplications: applications.filter(app => app.status === 'pending').length,
          acceptedApplications: applications.filter(app => app.status === 'accepted').length
        });

        setRecentActivity(
          applications.slice(0, 5).map(app => ({
            type: 'application',
            title: 'Applied to opportunity',
            description: `Application status: ${app.status}`,
            date: app.created_date,
            status: app.status
          }))
        );
      } else {
        // Show demo data
        setStats({
          totalApplications: allApplications.length,
          activeOpportunities: opportunities.filter(op => op.status === 'active').length,
          pendingApplications: allApplications.filter(app => app.status === 'pending').length,
          acceptedApplications: allApplications.filter(app => app.status === 'accepted').length
        });

        setRecentActivity(
          allApplications.slice(0, 5).map(app => ({
            type: 'application',
            title: 'Application submitted',
            description: `Status: ${app.status}`,
            date: app.created_date,
            status: app.status
          }))
        );
      }
    } catch (error) {
      console.error("Error loading executive dashboard:", error);
    }
  };

  const loadStartupDashboard = async (userData) => {
    try {
      const startupProfiles = await base44.entities.Startup.list();
      const startupProfile = startupProfiles.find(s => s.user_id === userData.id);
      setProfile(startupProfile);

      const allOpps = await base44.entities.Opportunity.list();
      const allApps = await base44.entities.Application.list();

      if (startupProfile) {
        const opportunities = allOpps.filter(opp => opp.startup_id === startupProfile.id);
        const allApplications = allApps.filter(app => 
          opportunities.some(opp => opp.id === app.opportunity_id)
        );

        setStats({
          totalOpportunities: opportunities.length,
          activeOpportunities: opportunities.filter(op => op.status === 'active').length,
          totalApplications: allApplications.length,
          pendingReviews: allApplications.filter(app => app.status === 'pending').length
        });

        setRecentActivity(
          allApplications.slice(0, 5).map(app => ({
            type: 'application_received',
            title: 'New application received',
            description: 'Review and respond to candidate',
            date: app.created_date,
            status: app.status
          }))
        );
      } else {
        // Show demo data
        setStats({
          totalOpportunities: allOpps.length,
          activeOpportunities: allOpps.filter(op => op.status === 'active').length,
          totalApplications: allApps.length,
          pendingReviews: allApps.filter(app => app.status === 'pending').length
        });

        setRecentActivity(
          allApps.slice(0, 5).map(app => ({
            type: 'application_received',
            title: 'Application received',
            description: 'Review candidate profile',
            date: app.created_date,
            status: app.status
          }))
        );
      }
    } catch (error) {
      console.error("Error loading startup dashboard:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-slate-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Please sign in</h2>
          <Button onClick={() => base44.auth.redirectToLogin()}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <WelcomeSection user={user} profile={profile} />
      
      <StatsCards 
        userType={user.user_type}
        stats={stats}
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentActivity 
            activities={recentActivity}
            userType={user.user_type}
          />
        </div>
        
        <div>
          <QuickActions 
            userType={user.user_type}
            hasProfile={!!profile}
          />
        </div>
      </div>
    </div>
  );
}