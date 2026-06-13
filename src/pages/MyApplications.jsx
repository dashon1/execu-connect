import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Building2, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";
import { format } from "date-fns";

export default function MyApplications() {
  const [user, setUser] = useState(null);
  const [executive, setExecutive] = useState(null);
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      if (userData.user_type === 'executive') {
        const executives = await base44.entities.Executive.list();
        const executiveProfile = executives.find(e => e.user_id === userData.id);
        setExecutive(executiveProfile);

        if (executiveProfile) {
          const allApps = await base44.entities.Application.list();
          const applicationsData = allApps.filter(app => app.executive_id === executiveProfile.id);
          const opportunitiesData = await base44.entities.Opportunity.list();
          const startupsData = await base44.entities.Startup.list();

          setApplications(applicationsData);
          setOpportunities(opportunitiesData);
          setStartups(startupsData);
        }
      }
    } catch (error) {
      console.error("Error loading applications:", error);
    }
    setLoading(false);
  };

  const getOpportunityForApplication = (opportunityId) => {
    return opportunities.find(opp => opp.id === opportunityId);
  };

  const getStartupForOpportunity = (startupId) => {
    return startups.find(startup => startup.id === startupId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'reviewed':
        return <Eye className="w-5 h-5 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-500" />;
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

  if (!user || user.user_type !== 'executive') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
        <p className="text-slate-600">This page is for executives only.</p>
      </div>
    );
  }

  if (!executive) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Complete Your Profile</h2>
        <p className="text-slate-600 mb-4">Please complete your executive profile first.</p>
        <Button onClick={() => window.location.href = '/Profile'}>
          Complete Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          My Applications
        </h1>
        <p className="text-slate-600">
          Track the status of your opportunity applications
        </p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No applications yet
            </h3>
            <p className="text-slate-600 mb-4">
              You haven't applied to any opportunities yet. Start browsing to find your next role.
            </p>
            <Button onClick={() => window.location.href = '/Opportunities'}>
              Browse Opportunities
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => {
            const opportunity = getOpportunityForApplication(application.opportunity_id);
            const startup = opportunity ? getStartupForOpportunity(opportunity.startup_id) : null;

            return (
              <Card key={application.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {opportunity?.title || 'Opportunity Title'}
                      </CardTitle>
                      
                      {startup && (
                        <div className="flex items-center gap-2 text-slate-600 mb-3">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">{startup.company_name}</span>
                          <Badge variant="outline" className="capitalize">
                            {startup.stage?.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">
                            {startup.industry}
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied {format(new Date(application.created_date), 'MMM d, yyyy')}
                        </div>
                        
                        {application.proposed_rate && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${application.proposed_rate}/hr
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className={getStatusColor(application.status)}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">{application.status}</span>
                      </Badge>
                      
                      {opportunity && (
                        <div className="text-sm text-slate-500">
                          ${opportunity.budget_min?.toLocaleString()} - ${opportunity.budget_max?.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 mb-2">Your Cover Message:</p>
                      <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-lg">
                        {application.cover_message}
                      </p>
                    </div>

                    {opportunity && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Duration:</span>
                          <div className="font-medium">{opportunity.duration_months} months</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Time:</span>
                          <div className="font-medium">{opportunity.hours_per_week}h/week</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Location:</span>
                          <div className="font-medium capitalize">{opportunity.location_requirement}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Type:</span>
                          <div className="font-medium capitalize">{opportunity.type}</div>
                        </div>
                      </div>
                    )}

                    {application.availability_start && (
                      <div className="text-sm">
                        <span className="text-slate-500">Available from:</span>
                        <span className="ml-2 font-medium">
                          {format(new Date(application.availability_start), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
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