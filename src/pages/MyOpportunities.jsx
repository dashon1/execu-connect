import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Users, Calendar, DollarSign, MapPin, Clock, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MyOpportunities() {
  const [user, setUser] = useState(null);
  const [startup, setStartup] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      if (userData.user_type === 'startup') {
        const startups = await base44.entities.Startup.list();
        const startupProfile = startups.find(s => s.user_id === userData.id);
        setStartup(startupProfile);

        if (startupProfile) {
          const allOpps = await base44.entities.Opportunity.list();
          const opportunitiesData = allOpps.filter(opp => opp.startup_id === startupProfile.id);

          setOpportunities(opportunitiesData);

          const allApplications = await base44.entities.Application.list();
          setApplications(allApplications);
        }
      }
    } catch (error) {
      console.error("Error loading opportunities:", error);
    }
    setLoading(false);
  };

  const getApplicationsForOpportunity = (opportunityId) => {
    return applications.filter(app => app.opportunity_id === opportunityId);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      filled: 'bg-blue-100 text-blue-800 border-blue-200',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      closed: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== 'startup') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
        <p className="text-slate-600">This page is for startups only.</p>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Complete Your Profile</h2>
        <p className="text-slate-600 mb-4">Please complete your startup profile first.</p>
        <Button onClick={() => window.location.href = '/Profile'}>
          Complete Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            My Opportunities
          </h1>
          <p className="text-slate-600">
            Manage your posted opportunities and review applications
          </p>
        </div>
        
        <Link to={createPageUrl("PostOpportunity")}>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Post New Opportunity
          </Button>
        </Link>
      </div>

      {opportunities.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No opportunities posted
            </h3>
            <p className="text-slate-600 mb-4">
              Post your first opportunity to start finding fractional executives.
            </p>
            <Link to={createPageUrl("PostOpportunity")}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Post Opportunity
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {opportunities.map((opportunity) => {
            const opportunityApplications = getApplicationsForOpportunity(opportunity.id);
            const pendingApplications = opportunityApplications.filter(app => app.status === 'pending').length;

            return (
              <Card key={opportunity.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {opportunity.title}
                      </CardTitle>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className={getStatusColor(opportunity.status)}>
                          {opportunity.status}
                        </Badge>
                        
                        <Badge variant="outline" className="capitalize">
                          {opportunity.type}
                        </Badge>
                        
                        {opportunity.specialization_needed?.map((spec, index) => (
                          <Badge key={index} variant="outline">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Posted {format(new Date(opportunity.created_date), 'MMM d, yyyy')}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {opportunityApplications.length} applications
                        </div>

                        {pendingApplications > 0 && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <Clock className="w-4 h-4" />
                            {pendingApplications} pending
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-slate-900 mb-1">
                        ${opportunity.budget_min?.toLocaleString()} - ${opportunity.budget_max?.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500">
                        {opportunity.hours_per_week}h/week
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-700 line-clamp-2">
                      {opportunity.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="capitalize">{opportunity.location_requirement}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{opportunity.duration_months} months</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <div className="text-sm text-slate-500">
                        {opportunityApplications.length} total applications
                        {pendingApplications > 0 && ` • ${pendingApplications} pending review`}
                      </div>
                      
                      <div className="text-sm text-slate-500">
                        Last updated {format(new Date(opportunity.updated_date), 'MMM d')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}