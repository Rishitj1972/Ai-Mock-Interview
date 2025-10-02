import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeCVWithGemini(cvText: string) {
  try {
    // First, validate if the content is actually a CV/Resume
    const isValidCV = await validateIfCV(cvText);
    if (!isValidCV) {
      throw new Error("The uploaded file doesn't appear to be a CV/Resume. Please upload a valid CV document.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
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

// Function to validate if the content is actually a CV
async function validateIfCV(text: string): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const validationPrompt = `
    Analyze the following text and determine if it's a CV/Resume or not.
    
    Text content:
    ${text.substring(0, 2000)} // Only send first 2000 characters for validation
    
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