import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, DollarSign, Clock, User as UserIcon, Award, Briefcase, ExternalLink, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Executives() {
  const [user, setUser] = useState(null);
  const [startup, setStartup] = useState(null);
  const [executives, setExecutives] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredExecutives, setFilteredExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [messageForm, setMessageForm] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterExecutives();
  }, [executives, searchTerm, specializationFilter, industryFilter, availabilityFilter]);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      if (userData.user_type === 'startup') {
        const startups = await base44.entities.Startup.list();
        setStartup(startups.find(s => s.user_id === userData.id));
      }

      const executivesData = await base44.entities.Executive.list();
      const usersData = await base44.entities.User.list();

      setExecutives(executivesData.filter(exec => exec.is_active));
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading executives:", error);
    }
    setLoading(false);
  };

  const filterExecutives = () => {
    let filtered = executives;

    if (searchTerm) {
      filtered = filtered.filter(exec => {
        const execUser = getUserForExecutive(exec.user_id);
        return (
          execUser?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          execUser?.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exec.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    if (specializationFilter !== 'all') {
      filtered = filtered.filter(exec => 
        exec.specializations?.includes(specializationFilter)
      );
    }

    if (industryFilter !== 'all') {
      filtered = filtered.filter(exec => 
        exec.industries?.includes(industryFilter)
      );
    }

    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(exec => exec.availability === availabilityFilter);
    }

    setFilteredExecutives(filtered);
  };

  const getUserForExecutive = (userId) => {
    return users.find(user => user.id === userId);
  };

  const handleContact = (executive) => {
    setSelectedExecutive(executive);
    setMessageForm({ subject: '', message: '' });
    setSent(false);
    setShowContactModal(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSending(true);
    
    try {
      const execUser = getUserForExecutive(selectedExecutive.user_id);
      
      await base44.integrations.Core.SendEmail({
        to: execUser.email,
        subject: messageForm.subject || `Opportunity from ${startup.company_name}`,
        body: `Hello ${execUser.full_name},\n\nI'm from ${startup.company_name}. ${messageForm.message}\n\nCompany Details:\n- Company: ${startup.company_name}\n- Industry: ${startup.industry}\n- Stage: ${startup.stage?.replace('_', ' ')}\n\nBest regards,\n${user.full_name}\n${user.email}`,
        from_name: startup.company_name
      });
      
      setSent(true);
      setTimeout(() => {
        setShowContactModal(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
    }
    
    setSending(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-200 rounded"></div>
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
        <p className="text-slate-600 mb-4">Please complete your startup profile to browse executives.</p>
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
          Browse Executives
        </h1>
        <p className="text-slate-600">
          Find experienced fractional executives for your startup
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search executives..."
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

            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="FinTech">FinTech</SelectItem>
                <SelectItem value="HealthTech">HealthTech</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="full_time">Full Time</SelectItem>
                <SelectItem value="part_time">Part Time</SelectItem>
                <SelectItem value="project_based">Project Based</SelectItem>
                <SelectItem value="interim">Interim</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExecutives.length === 0 ? (
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-12 text-center">
                <UserIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No executives found
                </h3>
                <p className="text-slate-600">
                  Try adjusting your search criteria to find more executives.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredExecutives.map((executive) => {
            const execUser = getUserForExecutive(executive.user_id);
            
            return (
              <Card key={executive.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xl">
                        {execUser?.full_name?.charAt(0) || 'E'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-1">
                        {execUser?.full_name || 'Executive'}
                      </CardTitle>
                      
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{execUser?.title || 'Executive'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{execUser?.location || 'Location not specified'}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="capitalize">
                          {executive.availability?.replace('_', ' ')}
                        </Badge>
                        
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {executive.hours_per_week}h/week
                        </Badge>
                        
                        <Badge variant="outline" className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ${executive.hourly_rate}/hr
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {execUser?.bio && (
                      <p className="text-slate-700 text-sm line-clamp-2">
                        {execUser.bio}
                      </p>
                    )}

                    <div>
                      <p className="text-sm font-medium text-slate-900 mb-2">Specializations:</p>
                      <div className="flex flex-wrap gap-1">
                        {executive.specializations?.slice(0, 4).map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-slate-500">
                        {executive.experience_years} years experience
                      </div>
                      
                      <div className="flex gap-2">
                        {execUser?.linkedin_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(execUser.linkedin_url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            LinkedIn
                          </Button>
                        )}
                        
                        <Button onClick={() => handleContact(executive)} size="sm">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Executive</DialogTitle>
          </DialogHeader>
          
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Message Sent!
              </h3>
              <p className="text-slate-600">
                Your message has been sent successfully.
              </p>
            </div>
          ) : selectedExecutive && (
            <form onSubmit={handleSendMessage} className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {getUserForExecutive(selectedExecutive.user_id)?.full_name?.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{getUserForExecutive(selectedExecutive.user_id)?.full_name}</h3>
                    <div className="text-sm text-slate-600">
                      ${selectedExecutive.hourly_rate}/hr • {selectedExecutive.hours_per_week}h/week
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder={`Opportunity from ${startup.company_name}`}
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Introduce your company and the opportunity you'd like to discuss..."
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                  rows={6}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactModal(false)}
                  disabled={sending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={sending || !messageForm.message.trim()}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}