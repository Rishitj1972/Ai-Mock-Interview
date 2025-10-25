// import { useState } from 'react';
// import CVReviewResults from '@/components/cv-review-results';
import CVReview from '@/components/cv-upload';
import CVUploadSection from '@/components/cv-upload';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft } from 'lucide-react';

export default function CVReviewPage() {
  // const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // const [isAnalyzing, setIsAnalyzing] = useState(false);
  // const [reviewResults, setReviewResults] = useState<{
  //   score: number;
  //   strengths: string[];
  //   improvements: string[];
  //   suggestions: string[];
  // } | null>(null);

  // const handleStartOver = () => {
  //   setReviewResults(null);
  //   setUploadedFile(null);
  //   setIsAnalyzing(false);
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">AI CV Review</h1>
          <p className="text-muted-foreground">
            Upload your CV and get detailed AI-powered feedback to improve your chances
          </p>
        </div>

        {/* Conditional Rendering */}
        {/* {!reviewResults ? (
          // Show Upload Section when no results
          <CVUploadSection 
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
            setReviewResults={setReviewResults}
          />
        ) : ( */}
           {/* Show Results Section when analysis is complete */}
          {/* <div className="space-y-6">
            Back Button */}
            {/* <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={handleStartOver}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Analyze Another CV
              </Button>
              
              <div className="text-sm text-muted-foreground">
                File: {uploadedFile?.name}
              </div>
            </div> */}

            {/* Results Component */}
            {/* <CVReviewResults results={reviewResults} /> */}
            <CVReview />
          </div>
        {/* )} */}
      </div>
    // </div>
  );
}