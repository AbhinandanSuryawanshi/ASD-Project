import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { ArrowLeft, BarChart3, Layers, Image, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfusionMatrixHeatmap from "@/components/ConfusionMatrixHeatmap";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const API = `${BACKEND_URL}/api`;

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const ModelAnalysisPage = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({ questionnaire: null, image: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${API}/model-metrics`);
        console.log("Model metrics response:", response.data);
        if (response.data) {
          setMetrics(response.data);
        } else {
          setError("No metrics data received from server");
        }
      } catch (err) {
        console.error("Error fetching model metrics:", err);
        const errorMessage = err.response?.data?.detail || err.message || "Failed to load model metrics. Please ensure the backend server is running.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const buildMetricsChartData = (testMetrics, trainMetrics) => {
    if (!testMetrics) return [];
    const names = ["Accuracy", "Precision", "Recall", "F1 Score"];
    const keys = ["accuracy", "precision", "recall", "f1_score"];
    return keys.map((key, i) => ({
      name: names[i],
      test: Math.round((testMetrics[key] ?? 0) * 1000) / 1000,
      train: trainMetrics ? Math.round((trainMetrics[key] ?? 0) * 1000) / 1000 : null,
    })).filter((d) => d.test != null);
  };

  const buildFeatureImportanceData = (fi) => {
    if (!fi || typeof fi !== "object") return [];
    return Object.entries(fi)
      .map(([name, value]) => ({ name, value: Math.round(value * 1000) / 1000 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12);
  };

  const buildRocData = (roc) => {
    if (!roc || !roc.fpr || !roc.tpr) return [];
    return (roc.fpr || []).map((fpr, i) => ({
      fpr: Math.round(fpr * 100) / 100,
      tpr: Math.round((roc.tpr[i] ?? 0) * 100) / 100,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-text-secondary">Loading model analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Card className="bg-white rounded-2xl p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </Card>
      </div>
    );
  }

  const hasQuestionnaire = metrics.questionnaire && metrics.questionnaire.test_metrics;
  const hasImage = metrics.image && metrics.image.test_metrics;

  const questionnaireChartData = hasQuestionnaire
    ? buildMetricsChartData(
        metrics.questionnaire.test_metrics,
        metrics.questionnaire.train_metrics
      )
    : [];
  const imageChartData = hasImage
    ? buildMetricsChartData(
        metrics.image.test_metrics,
        metrics.image.train_metrics
      )
    : [];

  const moduleComparisonData = [
    hasQuestionnaire && {
      name: "Questionnaire",
      F1: Math.round((metrics.questionnaire.test_metrics.f1_score ?? 0) * 100) / 100,
      Accuracy: Math.round((metrics.questionnaire.test_metrics.accuracy ?? 0) * 100) / 100,
      Precision: Math.round((metrics.questionnaire.test_metrics.precision ?? 0) * 100) / 100,
      Recall: Math.round((metrics.questionnaire.test_metrics.recall ?? 0) * 100) / 100,
    },
    hasImage && {
      name: "Image",
      F1: Math.round((metrics.image.test_metrics.f1_score ?? 0) * 100) / 100,
      Accuracy: Math.round((metrics.image.test_metrics.accuracy ?? 0) * 100) / 100,
      Precision: Math.round((metrics.image.test_metrics.precision ?? 0) * 100) / 100,
      Recall: Math.round((metrics.image.test_metrics.recall ?? 0) * 100) / 100,
    },
  ].filter(Boolean);

  const questionnaireRoc = hasQuestionnaire && metrics.questionnaire.test_metrics.roc_curve
    ? buildRocData(metrics.questionnaire.test_metrics.roc_curve)
    : [];
  const imageRoc = hasImage && metrics.image.test_metrics.roc_curve
    ? buildRocData(metrics.image.test_metrics.roc_curve)
    : [];

  const featureImportanceData = hasQuestionnaire && metrics.questionnaire.feature_importance
    ? buildFeatureImportanceData(metrics.questionnaire.feature_importance)
    : [];

  return (
    <div className="min-h-screen gradient-hero py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Home
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-text-primary mb-2 flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-primary" />
            Model Analysis
          </h1>
          <p className="text-lg text-text-secondary mb-10">
            Questionnaire and image module performance: F1 score, confusion matrices, and metrics.
          </p>

          {/* Module comparison: F1 & metrics bar chart */}
          {moduleComparisonData.length > 0 && (
            <Card className="bg-white rounded-2xl border border-stone-100 p-6 mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Module comparison (test set)
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fill: "#57534e" }} />
                    <YAxis domain={[0, 1.05]} tick={{ fill: "#57534e" }} />
                    <Tooltip formatter={(v) => (typeof v === "number" ? (v * 100).toFixed(1) + "%" : v)} />
                    <Legend />
                    <Bar dataKey="F1" fill={COLORS[0]} name="F1 Score" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Accuracy" fill={COLORS[1]} name="Accuracy" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Precision" fill={COLORS[2]} name="Precision" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Recall" fill={COLORS[3]} name="Recall" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          <Tabs defaultValue="questionnaire" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="questionnaire" className="flex items-center gap-2">
                <FileQuestion className="w-4 h-4" />
                Questionnaire module
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Image module
              </TabsTrigger>
            </TabsList>

            <TabsContent value="questionnaire" className="space-y-8">
              {!hasQuestionnaire ? (
                <Card className="p-8 text-center text-text-secondary">
                  No questionnaire metrics available. Train the model to generate metrics.
                </Card>
              ) : (
                <>
                  <Card className="bg-white rounded-2xl border border-stone-100 p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Test metrics (F1, Precision, Recall, Accuracy)</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={questionnaireChartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" tick={{ fill: "#57534e" }} />
                          <YAxis domain={[0, 1.05]} tick={{ fill: "#57534e" }} />
                          <Tooltip formatter={(v) => (typeof v === "number" ? (v * 100).toFixed(1) + "%" : v)} />
                          <Legend />
                          <Bar dataKey="test" fill={COLORS[0]} name="Test" radius={[4, 4, 0, 0]} />
                          {metrics.questionnaire.train_metrics && (
                            <Bar dataKey="train" fill={COLORS[1]} name="Train" radius={[4, 4, 0, 0]} />
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ConfusionMatrixHeatmap
                      matrix={metrics.questionnaire.test_metrics.confusion_matrix}
                      title="Questionnaire – Confusion matrix (test)"
                    />
                    {metrics.questionnaire.train_metrics && (
                      <ConfusionMatrixHeatmap
                        matrix={metrics.questionnaire.train_metrics.confusion_matrix}
                        title="Questionnaire – Confusion matrix (train)"
                      />
                    )}
                  </div>

                  {featureImportanceData.length > 0 && (
                    <Card className="bg-white rounded-2xl border border-stone-100 p-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">Feature importance (questionnaire)</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={featureImportanceData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" domain={[0, "auto"]} tick={{ fill: "#57534e" }} />
                            <YAxis type="category" dataKey="name" width={75} tick={{ fill: "#57534e", fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" name="Importance" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  )}

                  {questionnaireRoc.length > 0 && (
                    <Card className="bg-white rounded-2xl border border-stone-100 p-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">ROC curve (questionnaire, test)</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={questionnaireRoc} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="fpr" name="FPR" tick={{ fill: "#57534e" }} />
                            <YAxis dataKey="tpr" name="TPR" domain={[0, 1.05]} tick={{ fill: "#57534e" }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="tpr" stroke="#3b82f6" strokeWidth={2} dot={false} name="TPR" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="image" className="space-y-8">
              {!hasImage ? (
                <Card className="p-8 text-center text-text-secondary">
                  No image module metrics available. Train the image model to generate metrics.
                </Card>
              ) : (
                <>
                  <Card className="bg-white rounded-2xl border border-stone-100 p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Test metrics (F1, Precision, Recall, Accuracy)</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={imageChartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" tick={{ fill: "#57534e" }} />
                          <YAxis domain={[0, 1.05]} tick={{ fill: "#57534e" }} />
                          <Tooltip formatter={(v) => (typeof v === "number" ? (v * 100).toFixed(1) + "%" : v)} />
                          <Legend />
                          <Bar dataKey="test" fill={COLORS[0]} name="Test" radius={[4, 4, 0, 0]} />
                          {metrics.image.train_metrics && (
                            <Bar dataKey="train" fill={COLORS[1]} name="Train" radius={[4, 4, 0, 0]} />
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ConfusionMatrixHeatmap
                      matrix={metrics.image.test_metrics.confusion_matrix}
                      title="Image – Confusion matrix (test)"
                    />
                    {metrics.image.train_metrics && (
                      <ConfusionMatrixHeatmap
                        matrix={metrics.image.train_metrics.confusion_matrix}
                        title="Image – Confusion matrix (train)"
                      />
                    )}
                  </div>

                  {imageRoc.length > 0 && (
                    <Card className="bg-white rounded-2xl border border-stone-100 p-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">ROC curve (image, test)</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={imageRoc} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="fpr" name="FPR" tick={{ fill: "#57534e" }} />
                            <YAxis dataKey="tpr" name="TPR" domain={[0, 1.05]} tick={{ fill: "#57534e" }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="tpr" stroke="#10b981" strokeWidth={2} dot={false} name="TPR" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ModelAnalysisPage;
