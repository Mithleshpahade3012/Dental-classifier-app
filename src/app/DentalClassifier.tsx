"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Image from 'next/image';


interface PredictionResult {
  predicted_disease: string;
  condition: string;
  confidence: string;
  advice: string;
  gradcam_base64?: string;
}


export default function DentalClassifier() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setImage(URL.createObjectURL(uploadedFile));
    }
  };

  

  const handlePredict = async () => {
    if (!file) return alert("Please upload an image first.");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/prediction/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to fetch prediction");

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Prediction failed. Check the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleReupload = () => {
    setImage(null);
    setFile(null);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-[url('/child-dentist-kenya.jpg')] bg-cover bg-center">
      {/* Navbar */}
      <Navbar />
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-6 gap-6">
            <Card className="p-6 w-full max-w-md bg-white shadow-lg rounded-xl">
            <CardContent className="flex flex-col items-center">
                <motion.h1 
                className="text-2xl font-bold mb-4" 
                animate={{ opacity: 1, y: 0 }} 
                initial={{ opacity: 0, y: -20 }}
                >
                
                </motion.h1>

                <label
                htmlFor="file-upload"
                className="cursor-pointer border-2 border-dashed border-gray-400 rounded-lg p-4 w-full text-center hover:border-blue-500 transition"
                >
                <p className="text-gray-600">Click to Upload Image</p>
                <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {image && (
                  <Image
                    src={image}
                    alt="Uploaded"
                    width={200}
                    height={200}
                    className="rounded-lg mt-4 mb-4 shadow-md"
                  />
                )}
                <br></br>
                <Button onClick={handlePredict} disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800">
                {loading ? "Analyzing..." : "🦷 Predict Condition"}
                </Button>
            </CardContent>
            </Card>

            {prediction && (
            <motion.div 
                className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6 flex flex-col items-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
            >  
                {prediction.gradcam_base64 && (
                <div className="flex-shrink-0 text-center">
                    <h2 className="text-xl font-bold mb-2">🩺 Prediction</h2>
                    <Image
                      src={`data:image/png;base64,${prediction.gradcam_base64}`}
                      alt="Grad-CAM"
                      width={300}
                      height={300}
                      className="rounded-lg shadow-md"
                    />
                    <p className="text-sm text-blue-600 mt-1">Heatmap</p>
                </div>
                )}

                <div className="text-center mt-4">
                <p className="text-lg font-bold mb-2">Disease: <span className="text-red-500">{prediction.predicted_disease}</span></p>
                <p className="text-lg font-semibold mb-2">Condition: <span className="text-gray-700">{prediction.condition}</span></p>
                <p className="text-sm text-gray-600 mb-2">Accuracy: <span className="text-green-500">{prediction.confidence}</span></p>
                <p className="text-sm text-gray-600 mb-2">Advice: <span className="text-gray-700">{prediction.advice}</span></p>
                <Button onClick={handleReupload} className="mt-4 w-full text-black bg-red-50 hover:bg-red-500">
                    Close
                </Button>
                </div>
            </motion.div>
            )}
        </div>
        <div>
            
        </div>
    </div>
  );
}
