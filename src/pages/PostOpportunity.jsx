import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PostOpportunity() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [startup, setStartup] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'fractional',
    specialization_needed: [],
    budget_min: '',
    budget_max: '',
    duration_months: '',
    hours_per_week: '',
    location_requirement: 'remote',
    required_skills: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      if (userData.user_type === 'startup') {
        const startups = await base44.entities.Startup.list();
        setStartup(startups.find(s => s.user_id === userData.id));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await base44.entities.Opportunity.create({
        ...formData,
        startup_id: startup.id,
        budget_min: parseFloat(formData.budget_min) || 0,
        budget_max: parseFloat(formData.budget_max) || 0,
        duration_months: parseInt(formData.duration_months) || 0,
        hours_per_week: parseInt(formData.hours_per_week) || 0,
        status: 'active'
      });
      
      navigate(createPageUrl("MyOpportunities"));
    } catch (error) {
      console.error("Error posting opportunity:", error);
    }
    setSaving(false);
  };

  const addSpecialization = (specialization) => {
    if (specialization && !formData.specialization_needed.includes(specialization)) {
      setFormData({
        ...formData,
        specialization_needed: [...formData.specialization_needed, specialization]
      });
    }
  };

  const removeSpecialization = (index) => {
    setFormData({
      ...formData,
      specialization_needed: formData.specialization_needed.filter((_, i) => i !== index)
    });
  };

  const addSkill = () => {
    if (newSkill && !formData.required_skills.includes(newSkill)) {
      setFormData({
        ...formData,
        required_skills: [...formData.required_skills, newSkill]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
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
        <Button onClick={() => navigate(createPageUrl("Profile"))}>
          Complete Profile
        </Button>
      </div>
    );
  }

  const specializations = ["CMO", "CTO", "CFO", "COO", "CPO", "CHRO", "CSO", "CCO", "CDO", "Strategy", "Operations", "Sales", "Marketing", "Product", "Engineering", "Finance", "Legal", "Design", "Data", "Security", "Compliance", "International", "Partnerships", "Business Development"];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("MyOpportunities"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Post New Opportunity</h1>
            <p className="text-slate-600">Find your next fractional executive</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Opportunity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title">Opportunity Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Fractional CMO for FinTech Startup"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Engagement Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({...formData, type: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fractional">Fractional</SelectItem>
                    <SelectItem value="advisory">Advisory</SelectItem>
                    <SelectItem value="mentorship">Mentorship</SelectItem>
                    <SelectItem value="project">Project-Based</SelectItem>
                    <SelectItem value="interim">Interim</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_requirement">Location Requirement</Label>
                <Select
                  value={formData.location_requirement}
                  onValueChange={(value) => setFormData({...formData, location_requirement: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="on_site">On-site</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_min">Minimum Budget ($)</Label>
                <Input
                  id="budget_min"
                  type="number"
                  value={formData.budget_min}
                  onChange={(e) => setFormData({...formData, budget_min: e.target.value})}
                  placeholder="5000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_max">Maximum Budget ($)</Label>
                <Input
                  id="budget_max"
                  type="number"
                  value={formData.budget_max}
                  onChange={(e) => setFormData({...formData, budget_max: e.target.value})}
                  placeholder="15000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_months">Duration (months)</Label>
                <Input
                  id="duration_months"
                  type="number"
                  value={formData.duration_months}
                  onChange={(e) => setFormData({...formData, duration_months: e.target.value})}
                  placeholder="12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours_per_week">Hours per Week</Label>
                <Input
                  id="hours_per_week"
                  type="number"
                  value={formData.hours_per_week}
                  onChange={(e) => setFormData({...formData, hours_per_week: e.target.value})}
                  placeholder="20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opportunity Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the role, responsibilities, and what you're looking for in an executive..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label>Required Specializations *</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {formData.specialization_needed.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {spec}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeSpecialization(index)}
                      />
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addSpecialization}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add specialization" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {specializations.filter(spec => !formData.specialization_needed.includes(spec)).map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Required Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {formData.required_skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {skill}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeSkill(index)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add required skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSkill}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(createPageUrl("MyOpportunities"))}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={saving || !formData.title || !formData.description || formData.specialization_needed.length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Posting...' : 'Post Opportunity'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}