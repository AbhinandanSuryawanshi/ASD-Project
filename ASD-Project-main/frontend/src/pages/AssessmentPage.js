import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CameraCapture from "@/components/CameraCapture";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [captureMethod, setCaptureMethod] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    ethnicity: "",
    country: "",
    jaundice: "",
    family_history: "",
    respondent: "",
    a1_score: "",
    a2_score: "",
    a3_score: "",
    a4_score: "",
    a5_score: "",
    a6_score: "",
    a7_score: "",
    a8_score: "",
    a9_score: "",
    a10_score: ""
  });

  const questions = [
    { id: "a1_score", text: "Do you often notice small sounds when others do not?" },
    { id: "a2_score", text: "Do you usually concentrate more on the whole picture, rather than the small details?" },
    { id: "a3_score", text: "In a social group, can you easily keep track of several different people's conversations?" },
    { id: "a4_score", text: "Do you find it easy to go back and forth between different activities?" },
    { id: "a5_score", text: "If there is an interruption, can you switch back to what you were doing very quickly?" },
    { id: "a6_score", text: "Do you find it easy to 'read between the lines' when someone is talking to you?" },
    { id: "a7_score", text: "Do you know how to tell if someone listening to you is getting bored?" },
    { id: "a8_score", text: "When you are reading a story, do you find it difficult to work out the characters' intentions?" },
    { id: "a9_score", text: "Are you fascinated by dates, numbers, or specific categories of information?" },
    { id: "a10_score", text: "Can you easily work out what someone is thinking or feeling just by looking at their face?" }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setImageFile(file);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await axios.post(`${API}/upload-image`, formDataUpload);
      setUploadedFilename(response.data.filename);
      toast.success("Image uploaded successfully");
      setShowCamera(false);
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleCameraCapture = (file) => {
    handleImageUpload(file);
  };

  const validateStep = () => {
    if (step === 1) {
      const required = ['name', 'age', 'gender', 'ethnicity', 'country', 'jaundice', 'family_history', 'respondent'];
      return required.every(field => formData[field] !== "");
    }
    if (step === 2) {
      const questions = ['a1_score', 'a2_score', 'a3_score', 'a4_score', 'a5_score'];
      return questions.every(field => formData[field] !== "");
    }
    if (step === 3) {
      const questions = ['a6_score', 'a7_score', 'a8_score', 'a9_score', 'a10_score'];
      return questions.every(field => formData[field] !== "");
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        demographic: {
          name: formData.name,
          age: parseInt(formData.age),
          gender: parseInt(formData.gender),
          ethnicity: parseInt(formData.ethnicity),
          country: formData.country,
          jaundice: parseInt(formData.jaundice),
          family_history: parseInt(formData.family_history),
          respondent: formData.respondent
        },
        behavioral: {
          a1_score: parseInt(formData.a1_score),
          a2_score: parseInt(formData.a2_score),
          a3_score: parseInt(formData.a3_score),
          a4_score: parseInt(formData.a4_score),
          a5_score: parseInt(formData.a5_score),
          a6_score: parseInt(formData.a6_score),
          a7_score: parseInt(formData.a7_score),
          a8_score: parseInt(formData.a8_score),
          a9_score: parseInt(formData.a9_score),
          a10_score: parseInt(formData.a10_score)
        },
        image_filename: uploadedFilename
      };

      const response = await axios.post(`${API}/assess`, payload);
      toast.success("Assessment completed successfully");
      navigate(`/results/${response.data.id}`);
    } catch (error) {
      toast.error("Failed to submit assessment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Assessment</h1>
          <p className="text-lg text-text-secondary">Complete all sections for accurate results</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`stepper-dot h-3 rounded-full transition-all duration-500 ${
                step === num ? 'bg-primary w-8' : 'bg-stone-200 w-3'
              }`}
            />
          ))}
        </div>

        <Card className="bg-white rounded-2xl border border-stone-100 p-8 md:p-12 shadow-card overflow-visible">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-text-primary mb-8">Demographic Information</h2>
                <div className="space-y-8 overflow-visible">
                  <div className="min-h-[4rem]">
                    <Label htmlFor="name" className="text-base font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      data-testid="name-input"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="h-14 rounded-xl border-stone-200 bg-stone-50 px-4 text-lg mt-2"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="min-h-[4rem]">
                    <Label htmlFor="age" className="text-base font-medium">Age</Label>
                    <Input
                      id="age"
                      data-testid="age-input"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      className="h-14 rounded-xl border-stone-200 bg-stone-50 px-4 text-lg mt-2"
                      placeholder="Enter age"
                    />
                  </div>
                  <div className="relative z-0 min-h-[4rem]">
                    <Label htmlFor="gender" className="text-base font-medium">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                      <SelectTrigger data-testid="gender-select" className="h-14 rounded-xl border-stone-200 bg-stone-50 px-4 text-lg mt-2">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent sideOffset={6} position="popper">
                        <SelectItem value="0">Male</SelectItem>
                        <SelectItem value="1">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative z-0 min-h-[4rem]">
                    <Label htmlFor="ethnicity" className="text-base font-medium">Ethnicity</Label>
                    <Input
                      id="ethnicity"
                      data-testid="ethnicity-input"
                      type="number"
                      value={formData.ethnicity}
                      onChange={(e) => handleChange('ethnicity', e.target.value)}
                      className="h-14 rounded-xl border-stone-200 bg-stone-50 px-4 text-lg mt-2"
                      placeholder="Ethnicity code (0-10)"
                    />
                  </div>
                  <div className="min-h-[4rem]">
                    <Label htmlFor="country" className="text-base font-medium">Country of Residence</Label>
                    <Input
                      id="country"
                      data-testid="country-input"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="h-14 rounded-xl border-stone-200 bg-stone-50 px-4 text-lg mt-2"
                      placeholder="Enter country"
                    />
                  </div>
                  <div className="min-h-[4rem]">
                    <Label className="text-base font-medium mb-3 block">Was born with jaundice?</Label>
                    <RadioGroup value={formData.jaundice} onValueChange={(value) => handleChange('jaundice', value)} className="flex flex-row items-center gap-6 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="jaundice-yes" data-testid="jaundice-yes" />
                        <Label htmlFor="jaundice-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="jaundice-no" data-testid="jaundice-no" />
                        <Label htmlFor="jaundice-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="min-h-[4rem]">
                    <Label className="text-base font-medium mb-3 block">Family history of autism?</Label>
                    <RadioGroup value={formData.family_history} onValueChange={(value) => handleChange('family_history', value)} className="flex flex-row items-center gap-6 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="family-yes" data-testid="family-history-yes" />
                        <Label htmlFor="family-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="family-no" data-testid="family-history-no" />
                        <Label htmlFor="family-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="relative z-0 min-h-[4rem]">
                    <Label htmlFor="respondent" className="text-base font-medium">Respondent</Label>
                    <Select value={formData.respondent} onValueChange={(value) => handleChange('respondent', value)}>
                      <SelectTrigger data-testid="respondent-select" className="h-14 rounded-xl border-stone-200 bg-stone-50 px-4 text-lg mt-2">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent sideOffset={6} position="popper">
                        <SelectItem value="Self">Self</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Health Professional">Health Professional</SelectItem>
                        <SelectItem value="Relative">Relative</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-text-primary mb-8">Behavioral Questions (1-5)</h2>
                <div className="space-y-8">
                  {questions.slice(0, 5).map((q, idx) => (
                    <div key={q.id}>
                      <Label className="text-base font-medium mb-3 block">{idx + 1}. {q.text}</Label>
                      <RadioGroup value={formData[q.id]} onValueChange={(value) => handleChange(q.id, value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id={`${q.id}-yes`} data-testid={`${q.id}-yes`} />
                          <Label htmlFor={`${q.id}-yes`} className="cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id={`${q.id}-no`} data-testid={`${q.id}-no`} />
                          <Label htmlFor={`${q.id}-no`} className="cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-text-primary mb-8">Behavioral Questions (6-10)</h2>
                <div className="space-y-8">
                  {questions.slice(5, 10).map((q, idx) => (
                    <div key={q.id}>
                      <Label className="text-base font-medium mb-3 block">{idx + 6}. {q.text}</Label>
                      <RadioGroup value={formData[q.id]} onValueChange={(value) => handleChange(q.id, value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id={`${q.id}-yes`} data-testid={`${q.id}-yes`} />
                          <Label htmlFor={`${q.id}-yes`} className="cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id={`${q.id}-no`} data-testid={`${q.id}-no`} />
                          <Label htmlFor={`${q.id}-no`} className="cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-text-primary mb-8">Capture Facial Photo</h2>
                <p className="text-text-secondary mb-8">Capture or upload a facial photo for enhanced analysis</p>
                
                {!imageFile ? (
                  <div className="space-y-4">
                    {/* Camera Capture Option */}
                    <div 
                      onClick={() => setShowCamera(true)}
                      className="border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      data-testid="open-camera-button"
                    >
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-lg font-medium text-text-primary mb-2">Use Camera</p>
                      <p className="text-sm text-text-muted">Take a photo using your device camera</p>
                    </div>

                    {/* File Upload Option */}
                    <div className="border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="image-upload"
                        data-testid="image-upload"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-10 h-10 text-primary" />
                        </div>
                        <p className="text-lg font-medium text-text-primary mb-2">Upload from Device</p>
                        <p className="text-sm text-text-muted">PNG, JPG up to 10MB</p>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-16 h-16 text-green-600" />
                    </div>
                    <p className="text-lg font-medium text-text-primary mb-2">Photo Captured Successfully</p>
                    <p className="text-sm text-text-muted mb-4">{imageFile.name}</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setImageFile(null);
                        setUploadedFilename(null);
                      }}
                      data-testid="remove-image-button"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full px-6 py-2"
                    >
                      Remove & Recapture
                    </Button>
                  </div>
                )}

                <p className="text-xs text-text-muted text-center mt-6">
                  Optional: This step can be skipped, but facial photo helps in comprehensive analysis
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              data-testid="back-button"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full px-6 py-3 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            {step < 4 ? (
              <Button
                onClick={handleNext}
                data-testid="next-button"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-3"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                data-testid="submit-button"
                className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 py-3 font-semibold"
              >
                {loading ? "Analyzing..." : "Complete Assessment"}
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default AssessmentPage;
