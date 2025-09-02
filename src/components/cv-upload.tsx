import { useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Upload, FileText, Loader2, Sparkles, X } from 'lucide-react';
import { analyzeCVWithGemini } from '@/lib/cv-analysis';
import { extractTextFromFile } from '@/lib/file-processor';

interface CVUploadSectionProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  setReviewResults: (results: any) => void;
}

export default function CVUploadSection({ 
  uploadedFile, 
  setUploadedFile, 
  isAnalyzing, 
  setIsAnalyzing, 
  setReviewResults 
}: CVUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // Simple notification - you can replace with toast library if available
    alert(message);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showNotification('File size must be less than 10MB', 'error');
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'text/plain'];
      const allowedExtensions = ['.pdf', '.txt'];
      
      const isValidType = allowedTypes.includes(file.type) || 
                         allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (!isValidType) {
        showNotification('Please upload a PDF or text file only', 'error');
        return;
      }
      
      setUploadedFile(file);
      showNotification('File uploaded successfully! Click "Analyze" to proceed.', 'success');
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      showNotification('Please upload a file first', 'error');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Step 1: Extract text from the uploaded file
      console.log('📄 Extracting text from file...');
      const cvText = await extractTextFromFile(uploadedFile);
      
      if (!cvText.trim()) {
        throw new Error('No text content found in the file. Please ensure your PDF contains selectable text.');
      }

      if (cvText.length < 100) {
        throw new Error('The file content seems too short to be a valid CV. Please upload a complete CV.');
      }

      console.log('✅ Extracted text length:', cvText.length);
      
      // Step 2: Analyze with Gemini AI
      console.log('🤖 Analyzing CV with Gemini AI...');
      const results = await analyzeCVWithGemini(cvText);
      
      console.log('📊 Analysis results:', results);
      
      // Step 3: Set results (this will trigger the results view)
      setReviewResults(results);
      
      console.log('🎉 CV analysis completed successfully!');
      
    } catch (error: any) {
      console.error('❌ Analysis failed:', error);
      showNotification(error.message || 'Failed to analyze CV. Please try again.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      // Validate dropped file
      if (file.size > 10 * 1024 * 1024) {
        showNotification('File size must be less than 10MB', 'error');
        return;
      }
      
      if (file.type === 'application/pdf' || file.type === 'text/plain' || 
          file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.txt')) {
        setUploadedFile(file);
        showNotification('File uploaded successfully!', 'success');
      } else {
        showNotification('Please upload a PDF or text file only', 'error');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Your CV
        </CardTitle>
        <CardDescription>
          Get instant AI-powered feedback on your resume. Supported formats: PDF, TXT (Max size: 10MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            uploadedFile 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          } ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}
          onClick={() => !isAnalyzing && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isAnalyzing}
          />
          
          {uploadedFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{uploadedFile.name}</p>
                <p className="text-sm text-green-600">
                  {formatFileSize(uploadedFile.size)} • Ready for analysis
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Click to upload your CV</p>
              <p className="text-sm text-muted-foreground">or drag and drop your file here</p>
              <p className="text-xs text-muted-foreground mt-2">PDF or TXT files only</p>
            </div>
          )}
        </div>

        {uploadedFile && (
          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyze} 
              className="flex-1" 
              disabled={isAnalyzing}
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing CV with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze CV with AI
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleRemoveFile}
              disabled={isAnalyzing}
              size="lg"
              className="px-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              <div>
                <p className="text-sm font-medium">AI is analyzing your CV...</p>
                <p className="text-xs text-blue-600">This may take 10-30 seconds. Please wait.</p>
              </div>
            </div>
          </div>
        )}

        {/* Help section */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p className="font-medium mb-2">💡 Tips for best results:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Ensure your CV is complete with contact info, experience, and skills</li>
            <li>Use a clear, readable format (avoid image-only PDFs)</li>
            <li>Include quantifiable achievements and relevant keywords</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}