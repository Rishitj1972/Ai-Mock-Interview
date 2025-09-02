import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface CVUploadSectionProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  setReviewResults: (results: { score: number; strengths: string[]; improvements: string[]; suggestions: string[] }) => void;
}

export default function CVUploadSection({ 
  uploadedFile, 
  setUploadedFile, 
  isAnalyzing, 
  setIsAnalyzing, 
  setReviewResults 
}: CVUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('document'))) {
      setUploadedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    try {
      // TODO: Implement CV analysis with Gemini AI
      const results = await analyzeCVWithAI(uploadedFile);
      setReviewResults(results);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Your CV
        </CardTitle>
        <CardDescription>
          Supported formats: PDF, DOC, DOCX (Max size: 5MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {uploadedFile ? (
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="font-medium">{uploadedFile.name}</span>
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Click to upload your CV</p>
              <p className="text-sm text-muted-foreground">or drag and drop</p>
            </div>
          )}
        </div>

        {uploadedFile && (
          <Button 
            onClick={handleAnalyze} 
            className="w-full" 
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing CV...
              </>
            ) : (
              'Analyze CV'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// TODO: Implement this function
async function analyzeCVWithAI(file: File) {
  console.log(`Analyzing file: ${file.name}`);
  
  // This will integrate with Gemini AI to analyze the CV
  // For now, return mock data
  return {
    score: 85,
    strengths: ['Strong technical skills', 'Good experience'],
    improvements: ['Add more quantified achievements', 'Improve formatting'],
    suggestions: ['Add relevant keywords', 'Optimize for ATS']
  };
}