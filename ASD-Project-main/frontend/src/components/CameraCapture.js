import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, X, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CameraCapture = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [facingMode, setFacingMode] = useState("user");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

  const confirm = () => {
    if (imgSrc) {
      // Convert base64 to blob
      fetch(imgSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          onCapture(file);
        });
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-white rounded-2xl p-6 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-text-primary">Capture Photo</h3>
          <Button
            variant="ghost"
            onClick={onClose}
            data-testid="close-camera-button"
            className="rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="relative mb-6 rounded-2xl overflow-hidden bg-black">
          {!imgSrc ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full rounded-2xl"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button
                  onClick={switchCamera}
                  data-testid="switch-camera-button"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-4 backdrop-blur-sm"
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
                <Button
                  onClick={capture}
                  data-testid="capture-photo-button"
                  className="bg-primary hover:bg-primary/90 text-white rounded-full p-6"
                >
                  <Camera className="w-8 h-8" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <img src={imgSrc} alt="Captured" className="w-full rounded-2xl" />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button
                  onClick={retake}
                  data-testid="retake-photo-button"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full px-6 py-3 backdrop-blur-sm"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={confirm}
                  data-testid="confirm-photo-button"
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Use Photo
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Position your face in the center of the frame for best results
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CameraCapture;
