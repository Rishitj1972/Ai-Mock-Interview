import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Define types for job role-based analysis
export interface JobRole {
  title: string;
  industry: string;
  level: 'Entry' | 'Mid' | 'Senior' | 'Executive';
}

export interface CVAnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

export interface RoleBasedCVAnalysisResult extends CVAnalysisResult {
  roleAlignment: {
    matchPercentage: number;
    missingSkills: string[];
    recommendedSections: string[];
  };
  industryInsights: {
    salaryRange?: string;
    demandLevel: 'High' | 'Medium' | 'Low';
    trendingSkills: string[];
  };
}

// Basic CV analysis function (existing functionality)
export async function analyzeCVWithGemini(cvText: string): Promise<CVAnalysisResult> {
  try {
    // First, validate if the content is actually a CV/Resume
    const isValidCV = await validateIfCV(cvText);
    if (!isValidCV) {
      throw new Error("The uploaded file doesn't appear to be a CV/Resume. Please upload a valid CV document.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompt = `
    You are an expert HR professional and CV reviewer. Analyze the following CV/Resume and provide a comprehensive review.
    
    CV Content:
    ${cvText}
    
    Please provide your analysis in the following JSON format ONLY (no additional text before or after):
    {
      "score": [number between 30-100 based on overall quality],
      "strengths": ["specific strength 1", "specific strength 2", "specific strength 3", "specific strength 4"],
      "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3", "specific improvement 4"],
      "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3", "actionable suggestion 4"]
    }
    
    Evaluation Criteria:
    1. Professional formatting and structure
    2. Clarity and relevance of content
    3. Skills and experience presentation
    4. Achievement quantification
    5. ATS (Applicant Tracking System) optimization
    6. Grammar and language quality
    7. Contact information completeness
    8. Career progression logic
    
    Provide specific, actionable feedback that will help improve the CV's effectiveness.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    // Parse the JSON response
    const analysis = JSON.parse(cleanText);
    
    // Validate the response structure
    if (!analysis.score || !Array.isArray(analysis.strengths) || 
        !Array.isArray(analysis.improvements) || !Array.isArray(analysis.suggestions)) {
      throw new Error('Invalid response format from AI');
    }

    // Ensure score is within valid range
    if (analysis.score < 0 || analysis.score > 100) {
      analysis.score = Math.max(30, Math.min(100, analysis.score));
    }
    
    return analysis;
  } catch (error) {
    console.error('CV analysis failed:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to analyze CV. Please try again.');
  }
}

// New role-based CV analysis function
export async function analyzeRoleBasedCV(cvText: string, jobRole: JobRole): Promise<RoleBasedCVAnalysisResult> {
  try {
    // First, validate if the content is actually a CV/Resume
    const isValidCV = await validateIfCV(cvText);
    if (!isValidCV) {
      throw new Error("The uploaded file doesn't appear to be a CV/Resume. Please upload a valid CV document.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompt = `
    You are an expert HR professional and CV reviewer. Analyze the following CV/Resume specifically for a ${jobRole.title} position in the ${jobRole.industry} industry at ${jobRole.level} level.
    
    CV Content:
    ${cvText}
    
    Please provide your analysis in the following JSON format ONLY (no additional text before or after):
    {
      "score": [number between 30-100 based on overall quality],
      "roleAlignment": {
        "matchPercentage": [number between 0-100 based on role fit],
        "missingSkills": ["skill 1", "skill 2", "skill 3"],
        "recommendedSections": ["section 1", "section 2", "section 3"]
      },
      "strengths": ["specific strength 1", "specific strength 2", "specific strength 3", "specific strength 4"],
      "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3", "specific improvement 4"],
      "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3", "actionable suggestion 4"],
      "industryInsights": {
        "salaryRange": "salary range for this role",
        "demandLevel": "High|Medium|Low",
        "trendingSkills": ["trending skill 1", "trending skill 2", "trending skill 3"]
      }
    }
    
    Focus on:
    1. Industry-specific keywords and skills for ${jobRole.industry}
    2. Required experience level for ${jobRole.level} positions
    3. Missing technical/soft skills for ${jobRole.title}
    4. CV format optimization for this specific role
    5. Current market trends in ${jobRole.industry}
    6. Role-specific achievements and quantifiable results
    7. Industry certifications and qualifications
    8. Career progression alignment with ${jobRole.title}
    
    Provide specific, actionable feedback tailored to ${jobRole.title} positions.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    // Parse the JSON response
    const analysis = JSON.parse(cleanText);
    
    // Validate the response structure
    if (!analysis.score || !analysis.roleAlignment || !Array.isArray(analysis.strengths) || 
        !Array.isArray(analysis.improvements) || !Array.isArray(analysis.suggestions) ||
        !analysis.industryInsights) {
      throw new Error('Invalid response format from AI');
    }

    // Ensure score is within valid range
    if (analysis.score < 0 || analysis.score > 100) {
      analysis.score = Math.max(30, Math.min(100, analysis.score));
    }

    // Ensure match percentage is within valid range
    if (analysis.roleAlignment.matchPercentage < 0 || analysis.roleAlignment.matchPercentage > 100) {
      analysis.roleAlignment.matchPercentage = Math.max(0, Math.min(100, analysis.roleAlignment.matchPercentage));
    }
    
    return analysis;
  } catch (error) {
    console.error('Role-based CV analysis failed:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to analyze CV for the specified role. Please try again.');
  }
}

// Function to validate if the content is actually a CV
async function validateIfCV(text: string): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const validationPrompt = `
    Analyze the following text and determine if it's a CV/Resume or not.
    
    Text content:
    ${text.substring(0, 2000)}
    
    Respond with only "true" if this appears to be a CV/Resume, or "false" if it's not.
    
    A CV/Resume typically contains:
    - Personal/contact information
    - Work experience or employment history
    - Education details
    - Skills section
    - Professional summary or objective
    
    Response (true/false only):
    `;
    
    const result = await model.generateContent(validationPrompt);
    const response = await result.response;
    const isValid = response.text().trim().toLowerCase() === 'true';
    
    return isValid;
  } catch (error) {
    console.error('CV validation failed:', error);
    // If validation fails, assume it might be a CV to avoid blocking legitimate CVs
    return true;
  }
}

// Predefined job roles for easy selection
export const PREDEFINED_JOB_ROLES: JobRole[] = [
  // Technology Roles
  { title: "Software Engineer", industry: "Technology", level: "Mid" },
  { title: "Senior Software Engineer", industry: "Technology", level: "Senior" },
  { title: "Frontend Developer", industry: "Technology", level: "Mid" },
  { title: "Backend Developer", industry: "Technology", level: "Mid" },
  { title: "Full Stack Developer", industry: "Technology", level: "Mid" },
  { title: "Data Scientist", industry: "Technology", level: "Senior" },
  { title: "DevOps Engineer", industry: "Technology", level: "Mid" },
  { title: "Product Manager", industry: "Technology", level: "Senior" },
  { title: "UI/UX Designer", industry: "Technology", level: "Mid" },
  { title: "QA Engineer", industry: "Technology", level: "Mid" },
  
  // Business Roles
  { title: "Business Analyst", industry: "Business", level: "Mid" },
  { title: "Project Manager", industry: "Business", level: "Senior" },
  { title: "Marketing Manager", industry: "Marketing", level: "Mid" },
  { title: "Sales Manager", industry: "Sales", level: "Mid" },
  { title: "HR Manager", industry: "Human Resources", level: "Senior" },
  { title: "Financial Analyst", industry: "Finance", level: "Mid" },
  { title: "Operations Manager", industry: "Operations", level: "Senior" },
  
  // Entry Level Roles
  { title: "Junior Software Developer", industry: "Technology", level: "Entry" },
  { title: "Marketing Coordinator", industry: "Marketing", level: "Entry" },
  { title: "Sales Representative", industry: "Sales", level: "Entry" },
  { title: "Business Development Associate", industry: "Business", level: "Entry" },
  
  // Executive Roles
  { title: "Chief Technology Officer", industry: "Technology", level: "Executive" },
  { title: "Chief Marketing Officer", industry: "Marketing", level: "Executive" },
  { title: "VP of Engineering", industry: "Technology", level: "Executive" },
  { title: "Director of Sales", industry: "Sales", level: "Executive" },
];