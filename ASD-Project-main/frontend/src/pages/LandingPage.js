import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, ClipboardCheck, Activity, History, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning models trained on comprehensive ASD screening data"
    },
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "Comprehensive Assessment",
      description: "Evidence-based AQ-10 questionnaire combined with demographic analysis"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Detailed Results",
      description: "Get clear, actionable insights with visual breakdowns and recommendations"
    }
  ];

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="w-full py-6 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">ASD Screening</h1>
          </div>
          <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate('/analysis')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="hidden md:inline">Model Analysis</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/history')}
            data-testid="history-nav-button"
            className="flex items-center gap-2"
          >
            <History className="w-5 h-5" />
            <span className="hidden md:inline">History</span>
          </Button>
        </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 tracking-tight">
            Early Detection,
            <br />
            <span className="text-primary">Better Support</span>
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-8">
            A compassionate, evidence-based screening tool designed to help identify
            Autism Spectrum Disorder traits through advanced analysis and professional insights.
          </p>
          <Button
            onClick={() => navigate('/assessment')}
            data-testid="start-assessment-button"
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg font-semibold transition-all hover:shadow-button"
          >
            Start Assessment
          </Button>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <img
            src="https://images.unsplash.com/photo-1758691463331-2ac00e6f676f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxwZWRpYXRyaWNpYW4lMjBjb25zdWx0aW5nJTIwY2hpbGQlMjBmcmllbmRseXxlbnwwfHx8fDE3NjkwOTk0NDZ8MA&ixlib=rb-4.1.0&q=85"
            alt="Doctor consulting with family"
            className="w-full h-96 object-cover rounded-2xl shadow-card"
          />
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <Card className="bg-white rounded-2xl border border-stone-100 p-8 h-full hover:border-primary/20 transition-all duration-300 hover:shadow-hover">
                <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mb-6 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="text-base text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <Card className="bg-secondary/50 rounded-2xl border-none p-8 max-w-3xl mx-auto">
            <p className="text-sm text-text-secondary leading-relaxed">
              <strong className="text-text-primary">Important Notice:</strong> This screening tool is designed
              to assist in the early identification of ASD traits and is not a substitute for professional
              medical diagnosis. Please consult with a qualified healthcare provider for comprehensive
              evaluation and guidance.
            </p>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
