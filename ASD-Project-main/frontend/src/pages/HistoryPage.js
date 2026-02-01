import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HistoryPage = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get(`${API}/assessments`);
        setAssessments(response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const getRiskColor = (level) => {
    if (level === "Low") return "text-green-600";
    if (level === "Moderate") return "text-amber-600";
    return "text-red-600";
  };

  const getRiskBgColor = (level) => {
    if (level === "Low") return "bg-green-50";
    if (level === "Moderate") return "bg-amber-50";
    return "bg-red-50";
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-text-secondary">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              data-testid="back-home-button"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Home
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Assessment History</h1>
          <p className="text-lg text-text-secondary mb-12">
            {assessments.length} assessment{assessments.length !== 1 ? 's' : ''} completed
          </p>

          {assessments.length === 0 ? (
            <Card className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
              <Clock className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-text-primary mb-4">No Assessments Yet</h2>
              <p className="text-base text-text-secondary mb-6">
                Complete your first assessment to see your results here.
              </p>
              <Button
                onClick={() => navigate('/assessment')}
                data-testid="start-first-assessment-button"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-3 font-semibold"
              >
                Start Assessment
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {assessments.map((assessment, idx) => (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Card
                    className="bg-white rounded-2xl border border-stone-100 p-6 hover:border-primary/20 transition-all duration-300 hover:shadow-hover cursor-pointer"
                    onClick={() => navigate(`/results/${assessment.id}`)}
                    data-testid={`assessment-card-${idx}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`px-4 py-2 rounded-full ${getRiskBgColor(assessment.risk_level)}`}>
                            <span className={`text-sm font-semibold ${getRiskColor(assessment.risk_level)}`}>
                              {assessment.risk_level} Risk
                            </span>
                          </div>
                          <span className="text-sm text-text-muted">
                            {new Date(assessment.timestamp).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-text-muted mb-1">Age</p>
                            <p className="text-base font-semibold text-text-primary">{assessment.demographic.age} years</p>
                          </div>
                          <div>
                            <p className="text-xs text-text-muted mb-1">Gender</p>
                            <p className="text-base font-semibold text-text-primary">
                              {assessment.demographic.gender === 0 ? 'Male' : 'Female'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-text-muted mb-1">Probability</p>
                            <p className="text-base font-semibold text-primary">
                              {(assessment.probability * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-text-muted mb-1">Respondent</p>
                            <p className="text-base font-semibold text-text-primary">
                              {assessment.demographic.respondent}
                            </p>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-stone-400" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryPage;
