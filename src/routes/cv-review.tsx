import { useState } from 'react';
import CVReviewResults from '@/components/cv-review-results';
import CVUploadSection from '@/components/cv-upload';

export default function CVReviewPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewResults, setReviewResults] = useState<{
    score: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  } | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">AI CV Review</h1>
          <p className="text-muted-foreground">
            Upload your CV and get detailed AI-powered feedback to improve your chances
          </p>
        </div>

        {!reviewResults ? (
          <CVUploadSection 
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
            setReviewResults={setReviewResults}
          />
        ) : (
          <CVReviewResults results={reviewResults} />
        )}
      </div>
    </div>
  );
}