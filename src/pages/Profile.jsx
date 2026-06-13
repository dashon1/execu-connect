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

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      if (userData.user_type === 'executive') {
        const executives = await base44.entities.Executive.list();
        const executiveProfile = executives.find(e => e.user_id === userData.id);
        setProfile(executiveProfile);
        setFormData(executiveProfile || getDefaultExecutiveData());
        setIsEditing(true); // Always start in editing mode
      } else if (userData.user_type === 'startup') {
        const startups = await base44.entities.Startup.list();
        const startupProfile = startups.find(s => s.user_id === userData.id);
        setProfile(startupProfile);
        setFormData(startupProfile || getDefaultStartupData());
        setIsEditing(true); // Always start in editing mode
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
    setLoading(false);
  };

  const getDefaultExecutiveData = () => ({
    specializations: [],
    experience_years: 0,
    hourly_rate: 0,
    availability: 'part_time',
    hours_per_week: 20,
    industries: [],
    skills: [],
    achievements: [],
    is_active: true
  });

  const getDefaultStartupData = () => ({
    company_name: '',
    industry: '',
    stage: 'seed',
    team_size: 1,
    funding_raised: 0,
    website: '',
    description: '',
    needs: []
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      let savedProfile;
      
      if (user.user_type === 'executive') {
        if (profile) {
          savedProfile = await base44.entities.Executive.update(profile.id, formData);
        } else {
          savedProfile = await base44.entities.Executive.create({ ...formData, user_id: user.id });
        }
      } else if (user.user_type === 'startup') {
        if (profile) {
          savedProfile = await base44.entities.Startup.update(profile.id, formData);
        } else {
          savedProfile = await base44.entities.Startup.create({ ...formData, user_id: user.id });
        }
      }
      
      setProfile(savedProfile);
      setFormData(savedProfile);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile: " + (error.message || "Please check all fields"));
    }
    setSaving(false);
  };

  const addToArray = (field, value) => {
    if (value && !formData[field]?.includes(value)) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] || []), value]
      });
    }
  };

  const removeFromArray = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field]?.filter((_, i) => i !== index) || []
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

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Please sign in</h2>
        <Button onClick={() => base44.auth.redirectToLogin()}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {user.user_type === 'executive' ? 'Executive Profile' : 'Startup Profile'}
            </h1>
            <p className="text-slate-600">Manage your profile information</p>
          </div>
        </div>
        

      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {user.user_type === 'executive' ? (
            <ExecutiveProfileForm 
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              addToArray={addToArray}
              removeFromArray={removeFromArray}
            />
          ) : (
            <StartupProfileForm 
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              addToArray={addToArray}
              removeFromArray={removeFromArray}
            />
          )}
          
          <div className="flex justify-end gap-3 pt-6">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExecutiveProfileForm({ formData, setFormData, addToArray, removeFromArray }) {
  const isEditing = true; // Always editable
  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const specializations = ["CMO", "CTO", "CFO", "COO", "CPO", "CHRO", "CSO", "CCO", "CDO", "Strategy", "Operations", "Sales", "Marketing", "Product", "Engineering", "Finance", "Legal", "Design", "Data", "Security", "Compliance", "International", "Partnerships", "Business Development"];
  
  const industries = ["SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "AI/ML", "Blockchain", "IoT", "CleanTech", "AgTech", "PropTech", "InsurTech", "RetailTech", "FoodTech", "TravelTech", "Gaming", "Media", "Hardware", "Biotech", "Cybersecurity", "Enterprise Software", "Consumer Apps", "B2B", "B2C", "Marketplace"];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Experience Years</Label>
          <Input
            type="number"
            value={formData.experience_years || ''}
            onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value)})}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Hourly Rate ($)</Label>
          <Input
            type="number"
            value={formData.hourly_rate || ''}
            onChange={(e) => setFormData({...formData, hourly_rate: parseInt(e.target.value)})}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Availability</Label>
          <Select
            value={formData.availability || ''}
            onValueChange={(value) => setFormData({...formData, availability: value})}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_time">Full Time</SelectItem>
              <SelectItem value="part_time">Part Time</SelectItem>
              <SelectItem value="project_based">Project Based</SelectItem>
              <SelectItem value="mentorship_only">Mentorship Only</SelectItem>
              <SelectItem value="interim">Interim</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Hours per Week</Label>
          <Input
            type="number"
            value={formData.hours_per_week || ''}
            onChange={(e) => setFormData({...formData, hours_per_week: parseInt(e.target.value)})}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Specializations</Label>
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {formData.specializations?.map((spec, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {spec}
                {isEditing && (
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFromArray('specializations', index)}
                  />
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <Select onValueChange={(value) => addToArray('specializations', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Add specialization" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {specializations.map(spec => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <Label>Industries</Label>
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {formData.industries?.map((industry, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {industry}
                {isEditing && (
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFromArray('industries', index)}
                  />
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <Select onValueChange={(value) => addToArray('industries', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Add industry" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {formData.skills?.map((skill, index) => (
              <Badge key={index} variant="default" className="flex items-center gap-1">
                {skill}
                {isEditing && (
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFromArray('skills', index)}
                  />
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('skills', newSkill);
                    setNewSkill('');
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addToArray('skills', newSkill);
                  setNewSkill('');
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div>
          <Label>Achievements</Label>
          <div className="space-y-2 mt-2 mb-3">
            {formData.achievements?.map((achievement, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                <span className="flex-1">{achievement}</span>
                {isEditing && (
                  <X 
                    className="w-4 h-4 cursor-pointer text-slate-500 hover:text-red-500" 
                    onClick={() => removeFromArray('achievements', index)}
                  />
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add achievement"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('achievements', newAchievement);
                    setNewAchievement('');
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addToArray('achievements', newAchievement);
                  setNewAchievement('');
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StartupProfileForm({ formData, setFormData, addToArray, removeFromArray }) {
  const isEditing = true; // Always editable
  const [newNeed, setNewNeed] = useState('');

  const industries = ["SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "AI/ML", "Blockchain", "IoT", "CleanTech", "AgTech", "PropTech", "InsurTech", "RetailTech", "FoodTech", "TravelTech", "Gaming", "Media", "Hardware", "Biotech", "Cybersecurity", "Enterprise Software", "Consumer Apps", "B2B", "B2C", "Marketplace"];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Company Name</Label>
          <Input
            value={formData.company_name || ''}
            onChange={(e) => setFormData({...formData, company_name: e.target.value})}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Website</Label>
          <Input
            value={formData.website || ''}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Industry</Label>
          <Select
            value={formData.industry || ''}
            onValueChange={(value) => setFormData({...formData, industry: value})}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Funding Stage</Label>
          <Select
            value={formData.stage || ''}
            onValueChange={(value) => setFormData({...formData, stage: value})}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pre_seed">Pre-Seed</SelectItem>
              <SelectItem value="seed">Seed</SelectItem>
              <SelectItem value="series_a">Series A</SelectItem>
              <SelectItem value="series_b">Series B</SelectItem>
              <SelectItem value="series_c">Series C</SelectItem>
              <SelectItem value="growth">Growth</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Team Size</Label>
          <Input
            type="number"
            value={formData.team_size || ''}
            onChange={(e) => setFormData({...formData, team_size: parseInt(e.target.value)})}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Funding Raised ($)</Label>
          <Input
            type="number"
            value={formData.funding_raised || ''}
            onChange={(e) => setFormData({...formData, funding_raised: parseInt(e.target.value)})}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Company Description</Label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          disabled={!isEditing}
          rows={4}
        />
      </div>

      <div>
        <Label>Executive Needs</Label>
        <div className="flex flex-wrap gap-2 mt-2 mb-3">
          {formData.needs?.map((need, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {need}
              {isEditing && (
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFromArray('needs', index)}
                />
              )}
            </Badge>
          ))}
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <Input
              placeholder="Add executive need"
              value={newNeed}
              onChange={(e) => setNewNeed(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('needs', newNeed);
                  setNewNeed('');
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                addToArray('needs', newNeed);
                setNewNeed('');
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}