import type { FieldValue, Timestamp } from "firebase/firestore";

// User Type For Firestore 
export interface User {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    createdAt: Timestamp | FieldValue;
    updatedAt: Timestamp | FieldValue;
}


// Interview Type For Firestore
export interface Interview {
    id: string;
    position: string;
    description: string;
    experience: number;
    userId: string;
    techStack: string;
    questions: {question: string; answer: string}[];
    createdAt: Timestamp;
    updateAt: Timestamp;
}

// User Answer Type For Firestore
export interface UserAnswer {
    id: string;
    mockIdRef: string;
    question: string;
    correct_ans: string;
    user_ans: string;
    Feedback: string;
    rating: number;
    userId: string;
    createdAt: Timestamp ;
    updatedAt: Timestamp ;
}

export type { JobRole, CVAnalysisResult, RoleBasedCVAnalysisResult } from '@/lib/cv-analysis';