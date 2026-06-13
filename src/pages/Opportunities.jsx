import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, DollarSign, Clock, Briefcase, Building2, CheckCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Opportunities() {
  const [user, setUser] = useState(null);
  const [executive, setExecutive] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [startups, setStartups] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({ cover_message: '', proposed_rate: '', availability_start: '' });
  const [submitting, setSubmitting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterOpportunities();
  }, [opportunities, searchTerm, specializationFilter, typeFilter, locationFilter]);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      if (userData.user_type === 'executive') {
        const executives = await base44.entities.Executive.list();
        const executiveProfile = executives.find(e => e.user_id === userData.id);
        setExecutive(executiveProfile);
        
        const apps = await base44.entities.Application.list();
        setApplications(apps.filter(app => app.executive_id === executiveProfile?.id));
      }

      const opportunitiesData = await base44.entities.Opportunity.list();
      const startupsData = await base44.entities.Startup.list();

      setOpportunities(opportunitiesData.filter(opp => opp.status === 'active'));
      setStartups(startupsData);
    } catch (error) {
      console.error("Error loading opportunities:", error);
    }
    setLoading(false);
  };

  const filterOpportunities = () => {
    let filtered = opportunities;

    if (searchTerm) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specializationFilter !== 'all') {
      filtered = filtered.filter(opp => 
        opp.specialization_needed?.includes(specializationFilter)
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(opp => opp.type === typeFilter);
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(opp => opp.location_requirement === locationFilter);
    }

    setFilteredOpportunities(filtered);
  };

  const getStartupForOpportunity = (startupId) => {
    return startups.find(startup => startup.id === startupId);
  };

  const hasApplied = (opportunityId) => {
    return applications.some(app => app.opportunity_id === opportunityId);
  };

  const handleApply = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setApplicationForm({ cover_message: '', proposed_rate: '', availability_start: '' });
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await base44.entities.Application.create({
        ...applicationForm,
        opportunity_id: selectedOpportunity.id,
        executive_id: executive.id,
        proposed_rate: parseFloat(applicationForm.proposed_rate) || 0
      });
      
      setShowApplicationModal(false);
      await loadData();
    } catch (error) {
      console.error("Error submitting application:", error);
    }
    
    setSubmitting(false);
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
        <p className="text-slate-600 mb-4">Please complete your executive profile to browse opportunities.</p>
        <Button onClick={() => window.location.href = '/Profile'}>
          Complete Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Browse Opportunities
        </h1>
        <p className="text-slate-600">
          Find fractional executive opportunities that match your expertise
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="CMO">CMO</SelectItem>
                <SelectItem value="CTO">CTO</SelectItem>
                <SelectItem value="CFO">CFO</SelectItem>
                <SelectItem value="COO">COO</SelectItem>
                <SelectItem value="CPO">CPO</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fractional">Fractional</SelectItem>
                <SelectItem value="advisory">Advisory</SelectItem>
                <SelectItem value="mentorship">Mentorship</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="interim">Interim</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="on_site">On-site</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredOpportunities.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No opportunities found
              </h3>
              <p className="text-slate-600">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOpportunities.map((opportunity) => {
            const startup = getStartupForOpportunity(opportunity.startup_id);
            const applied = hasApplied(opportunity.id);
            
            return (
              <Card key={opportunity.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{opportunity.title}</CardTitle>
                      
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

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="capitalize">
                          {opportunity.type}
                        </Badge>
                        
                        {opportunity.specialization_needed?.map((spec, index) => (
                          <Badge key={index} variant="outline">
                            {spec}
                          </Badge>
                        ))}
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
                    <p className="text-slate-700 line-clamp-3">
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
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Posted {format(new Date(opportunity.created_date), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      {applied ? (
                        <Button disabled variant="outline" className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Applied
                        </Button>
                      ) : (
                        <Button onClick={() => handleApply(opportunity)} className="bg-blue-600 hover:bg-blue-700">
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for Opportunity</DialogTitle>
          </DialogHeader>
          
          {selectedOpportunity && (
            <form onSubmit={handleApplicationSubmit} className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{selectedOpportunity.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Budget:</span>
                    <div className="font-medium">${selectedOpportunity.budget_min?.toLocaleString()} - ${selectedOpportunity.budget_max?.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Time:</span>
                    <div className="font-medium">{selectedOpportunity.hours_per_week}h/week</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_message">Cover Message *</Label>
                <Textarea
                  id="cover_message"
                  placeholder="Explain why you're interested and how your experience makes you a great fit..."
                  value={applicationForm.cover_message}
                  onChange={(e) => setApplicationForm({...applicationForm, cover_message: e.target.value})}
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proposed_rate">Proposed Hourly Rate ($)</Label>
                  <Input
                    id="proposed_rate"
                    type="number"
                    placeholder="Your hourly rate"
                    value={applicationForm.proposed_rate}
                    onChange={(e) => setApplicationForm({...applicationForm, proposed_rate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability_start">Available Start Date</Label>
                  <Input
                    id="availability_start"
                    type="date"
                    value={applicationForm.availability_start}
                    onChange={(e) => setApplicationForm({...applicationForm, availability_start: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApplicationModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || !applicationForm.cover_message.trim()}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}