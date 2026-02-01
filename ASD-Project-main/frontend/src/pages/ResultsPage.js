import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowLeft, AlertCircle, CheckCircle, Info, Download, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(`${API}/assessments/${id}`);
        setResult(response.data);
      } catch (error) {
        console.error("Error fetching result:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const handleDownloadReport = async () => {
    setDownloadingReport(true);
    try {
      const response = await axios.get(`${API}/assessments/${id}/report`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ASD_Assessment_Report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report downloaded successfully");
    } catch (error) {
      toast.error("Failed to download report");
      console.error(error);
    } finally {
      setDownloadingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-text-secondary">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Card className="bg-white rounded-2xl p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-4">Assessment Not Found</h2>
          <Button onClick={() => navigate('/')} className="bg-primary text-white rounded-full px-6 py-3">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  const probabilityPercent = (result.probability * 100).toFixed(1);
  const confidencePercent = (result.confidence * 100).toFixed(1);

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

  const behavioralScores = [
    { label: "Sensory Awareness", value: result.behavioral.a1_score },
    { label: "Attention to Detail", value: result.behavioral.a2_score },
    { label: "Social Attention", value: result.behavioral.a3_score },
    { label: "Attention Switching", value: result.behavioral.a4_score },
    { label: "Cognitive Flexibility", value: result.behavioral.a5_score },
    { label: "Communication", value: result.behavioral.a6_score },
    { label: "Social Awareness", value: result.behavioral.a7_score },
    { label: "Social Imagination", value: result.behavioral.a8_score },
    { label: "Pattern Interests", value: result.behavioral.a9_score },
    { label: "Social Intuition", value: result.behavioral.a10_score }
  ];

  return (
    <div className="min-h-screen gradient-hero py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Assessment Results</h1>
          <p className="text-lg text-text-secondary mb-12">
            Completed on {new Date(result.timestamp).toLocaleDateString()}
          </p>

          {/* Risk Level Card */}
          <Card className={`${getRiskBgColor(result.risk_level)} rounded-2xl border-none p-8 mb-8`} data-testid="risk-level-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Risk Level</h2>
                <p className={`text-5xl font-bold ${getRiskColor(result.risk_level)}`}>
                  {result.risk_level}
                </p>
              </div>
              {result.risk_level === "Low" && <CheckCircle className="w-20 h-20 text-green-600" />}
              {result.risk_level === "Moderate" && <Info className="w-20 h-20 text-amber-600" />}
              {result.risk_level === "High" && <AlertCircle className="w-20 h-20 text-red-600" />}
            </div>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white rounded-2xl border border-stone-100 p-8">
              <h3 className="text-xl font-semibold text-text-primary mb-4">ASD Probability</h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-3xl font-bold text-primary">{probabilityPercent}%</span>
                </div>
                <Progress value={result.probability * 100} className="h-3" data-testid="probability-progress" />
              </div>
              <p className="text-sm text-text-secondary">Likelihood of ASD traits based on assessment responses</p>
            </Card>

            <Card className="bg-white rounded-2xl border border-stone-100 p-8">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Model Confidence</h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-3xl font-bold text-primary">{confidencePercent}%</span>
                </div>
                <Progress value={result.confidence * 100} className="h-3" data-testid="confidence-progress" />
              </div>
              <p className="text-sm text-text-secondary">Certainty level of the machine learning prediction</p>
            </Card>
          </div>

          {/* Behavioral Breakdown */}
          <Card className="bg-white rounded-2xl border border-stone-100 p-8 mb-8">
            <h3 className="text-2xl font-semibold text-text-primary mb-6">Behavioral Assessment Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {behavioralScores.map((score, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-base text-text-secondary">{score.label}</span>
                  <span className={`text-lg font-semibold ${
                    score.value === 1 ? 'text-primary' : 'text-text-muted'
                  }`}>
                    {score.value === 1 ? 'Yes' : 'No'}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="bg-white rounded-2xl border border-stone-100 p-8 mb-8">
            <h3 className="text-2xl font-semibold text-text-primary mb-6">Comprehensive Recommendations</h3>
            <Tabs defaultValue="medical" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="therapy">Therapy</TabsTrigger>
                <TabsTrigger value="yoga">Yoga</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              </TabsList>
              
              <TabsContent value="medical" className="space-y-3">
                {result.risk_level === "High" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Consult with a developmental pediatrician or child psychiatrist for comprehensive evaluation</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Consider Applied Behavior Analysis (ABA) therapy - evidence-based intervention</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Discuss medication options with psychiatrist if co-occurring conditions exist (anxiety, ADHD, sleep issues)</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Medications may include: Risperidone or Aripiprazole for irritability (FDA approved for ASD)</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Melatonin supplements for sleep regulation (consult doctor for dosage)</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Regular monitoring and follow-ups every 3-6 months</p>
                  </>
                )}
                {result.risk_level === "Moderate" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Schedule evaluation with developmental pediatrician within 3 months</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Consider Early Intervention Program (EIP) referral if under 3 years old</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Monitor developmental milestones closely</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Discuss preventive strategies with healthcare provider</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Annual comprehensive developmental screening recommended</p>
                  </>
                )}
                {result.risk_level === "Low" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Continue regular pediatric check-ups</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Monitor developmental milestones per age guidelines</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Stay informed about developmental health</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Consult healthcare provider if new concerns arise</p>
                  </>
                )}
              </TabsContent>

              <TabsContent value="therapy" className="space-y-3">
                {result.risk_level === "High" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Applied Behavior Analysis (ABA): 20-40 hours per week recommended</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Speech and Language Therapy: Focus on communication skills and social pragmatics</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Occupational Therapy: Address sensory processing and fine motor skills</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Social Skills Training: Group sessions for peer interaction</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Cognitive Behavioral Therapy (CBT): For managing anxiety and emotional regulation</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Parent training programs: PCIT (Parent-Child Interaction Therapy) or similar</p>
                  </>
                )}
                {result.risk_level === "Moderate" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Speech therapy if communication delays are present</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Occupational therapy for sensory sensitivities (2-3 sessions/week)</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Play-based therapy for social skill development</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Parent coaching sessions to learn supportive strategies</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Social skills groups (once weekly)</p>
                  </>
                )}
                {result.risk_level === "Low" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• No specific interventions required currently</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Consider enrichment activities for overall development</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Encourage social interaction through playgroups or activities</p>
                  </>
                )}
              </TabsContent>

              <TabsContent value="yoga" className="space-y-3">
                {result.risk_level === "High" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Child's Pose (Balasana): Calming effect, reduces anxiety - 2 minutes daily</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Tree Pose (Vrksasana): Improves balance and focus - 1 minute each leg</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Cat-Cow Stretch (Marjaryasana-Bitilasana): Body awareness and coordination - 5 repetitions</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Butterfly Pose (Baddha Konasana): Hip opening and calming - 2 minutes</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Deep Breathing (Pranayama): 5-10 minutes daily for emotional regulation</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Progressive Muscle Relaxation: Before bedtime for better sleep</p>
                  </>
                )}
                {result.risk_level === "Moderate" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Mountain Pose (Tadasana): Grounding and focus - 1 minute</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Warrior Pose (Virabhadrasana): Strength and confidence - 30 seconds each side</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Bridge Pose (Setu Bandhasana): Calming and energizing - 1 minute</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Seated Forward Bend (Paschimottanasana): Relaxation - 1-2 minutes</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Breathing exercises: 5 minutes daily</p>
                  </>
                )}
                {result.risk_level === "Low" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• General yoga practice for wellness (10-15 minutes daily)</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Sun Salutation (Surya Namaskar): Morning routine</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Simple breathing exercises for stress management</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Mindfulness activities: 5 minutes daily</p>
                  </>
                )}
              </TabsContent>

              <TabsContent value="lifestyle" className="space-y-3">
                {result.risk_level === "High" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Establish consistent daily routines with visual schedules</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Create a sensory-friendly environment at home (quiet spaces, soft lighting)</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Limit screen time to 1-2 hours daily with educational content</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Encourage physical activity: 60 minutes daily (swimming, cycling, dancing)</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Use social stories to prepare for new situations or transitions</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Implement positive reinforcement strategies consistently</p>
                  </>
                )}
                {result.risk_level === "Moderate" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Maintain predictable routines with some flexibility</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Encourage social play dates in structured settings</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Practice turn-taking and sharing through games</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Limit sensory overload in busy environments</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Use visual supports for daily activities</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Promote physical activities: team sports or group classes</p>
                  </>
                )}
                {result.risk_level === "Low" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Maintain healthy sleep schedule (9-11 hours for children)</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Encourage diverse social interactions</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Promote physical activity and outdoor play</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Limit screen time according to age-appropriate guidelines</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Foster creative expression through arts and music</p>
                  </>
                )}
              </TabsContent>

              <TabsContent value="nutrition" className="space-y-3">
                {result.risk_level === "High" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Gluten-free, casein-free diet (GFCF) - consult nutritionist before starting</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Omega-3 fatty acids: Fish oil supplements (500-1000mg daily)</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Probiotic-rich foods: Yogurt, kefir for gut health</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Avoid artificial colors, preservatives, and high-sugar foods</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Ensure adequate vitamin D (sunlight exposure or supplements)</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Zinc and magnesium supplements if deficient (blood test recommended)</p>
                  </>
                )}
                {result.risk_level === "Moderate" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Balanced diet with plenty of fruits and vegetables</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Omega-3 rich foods: Salmon, walnuts, flaxseeds</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Limit processed foods and added sugars</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Ensure adequate hydration throughout the day</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Consider multivitamin if dietary intake is limited</p>
                  </>
                )}
                {result.risk_level === "Low" && (
                  <>
                    <p className="text-base text-text-secondary leading-relaxed">• Follow balanced, nutritious diet</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Encourage variety in food choices</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Limit junk food and sugary beverages</p>
                    <p className="text-base text-text-secondary leading-relaxed">• Promote healthy eating habits and family meals</p>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </Card>

          {/* Disclaimer */}
          <Card className="bg-amber-50 rounded-2xl border-none p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Important Medical Disclaimer</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  This assessment is a screening tool only and is NOT a clinical diagnosis. The results are generated by a machine learning model and should be used as a reference point for discussions with qualified healthcare professionals. Always consult with a licensed medical practitioner for proper evaluation, diagnosis, and treatment recommendations.
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-12">
            <Button
              onClick={handleDownloadReport}
              disabled={downloadingReport}
              data-testid="download-report-button"
              className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 py-3 font-semibold flex items-center gap-2"
            >
              {downloadingReport ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Full Report (PDF)
                </>
              )}
            </Button>
            <Button
              onClick={() => navigate('/assessment')}
              data-testid="new-assessment-button"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-3 font-semibold"
            >
              New Assessment
            </Button>
            <Button
              onClick={() => navigate('/history')}
              data-testid="view-history-button"
              className="bg-secondary hover:bg-secondary/80 text-primary rounded-full px-8 py-3 font-semibold"
            >
              View History
            </Button>
            <Button
              onClick={() => navigate('/analysis')}
              variant="outline"
              className="rounded-full px-8 py-3 font-semibold flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              Model Analysis
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;
