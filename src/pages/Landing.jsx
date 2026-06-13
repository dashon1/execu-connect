import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Briefcase, 
  Star,
  TrendingUp,
  Shield,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Landing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await base44.auth.me();
      
      // Set user_type if not set (for demo purposes)
      if (!userData.user_type) {
        await base44.auth.updateMe({ user_type: 'executive' });
      }
      
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    window.location.href = createPageUrl("Dashboard");
    return null;
  }

  const features = [
    {
      icon: Users,
      title: "Vetted Executives",
      description: "Connect with experienced C-suite professionals ready for fractional roles"
    },
    {
      icon: Clock,
      title: "Flexible Arrangements",
      description: "From mentorship to interim leadership - find the perfect engagement model"
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Safe platform with verified profiles and secure communication"
    },
    {
      icon: TrendingUp,
      title: "Growth Focused",
      description: "Match with leaders who understand startup challenges and growth"
    }
  ];

  const stats = [
    { number: "500+", label: "Expert Executives" },
    { number: "1000+", label: "Startups Served" },
    { number: "95%", label: "Success Rate" },
    { number: "24h", label: "Avg Response Time" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-xl">ExecutiveConnect</h1>
              <p className="text-xs text-slate-500">Fractional Leadership</p>
            </div>
          </div>
          
          <Button 
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Connect Startups with
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}Fractional Executives
              </span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Bridge the gap between startups seeking experienced leadership and executives 
              ready for flexible, high-impact engagements. From CMOs to CTOs, find your perfect match.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => base44.auth.redirectToLogin()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 shadow-lg"
              >
                Start Connecting
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free to get started</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose ExecutiveConnect?
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The premier platform for fractional executive partnerships
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Match?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful partnerships. Whether you're a startup seeking leadership 
            or an executive ready for your next challenge.
          </p>
          
          <Button 
            size="lg"
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 shadow-lg"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">ExecutiveConnect</span>
          </div>
          <p className="text-slate-400">
            © 2024 ExecutiveConnect. Connecting startups with fractional leadership.
          </p>
        </div>
      </footer>
    </div>
  );
}