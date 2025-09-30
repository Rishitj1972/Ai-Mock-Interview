import Headings from '@/components/headings';
import InterviewPin from '@/components/pin';
import React, { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase.config'; 
import type { Interview, UserAnswer } from '@/types';
import { useAuth } from "@clerk/clerk-react";
import LoaderPage from './loader-page';
import CustomBreadCrumb from '@/components/custom-bread-crumb';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

  /**
 * Feedback Component - Displays interview Feedback and performance summary
 * Shows detailed Feedback for each question in an accordion format
 */
export const Feedback = () => {
    const { interviewId } = useParams<{ interviewId: string }>();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [Feedback, setFeedback] = useState<UserAnswer[]>([]); 
    const [activeFeed, setActiveFeed] = useState("");
    const { userId } = useAuth();
    const navigate = useNavigate();

    if (!interviewId) {
        navigate("/generate", { replace: true });
    }
    /**
     * useEffect hook to fetch interview and Feedback data when component mounts
     * Runs when interviewId, navigate, or userId changes
     */
    useEffect(() => {
        if (interviewId) {
            const fetchInterview = async () => {
                try {
                    const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
                    if (interviewDoc.exists()) {
                        setInterview({
                            id: interviewDoc.id,
                            ...interviewDoc.data(),
                        } as Interview);
                    }
                } catch (error) {
                    console.log("Error fetching interview:", error);
                }
            };

            const fetchFeedback = async () => {
                setIsLoading(true);
                try {
                    const querSampRef = query(
                        collection(db, "userAnswers"),
                        where("mockIdRef", "==", interviewId),
                        where("userId", "==", userId)
                    );
                    const querySnap = await getDocs(querSampRef);
                    const interviewData: UserAnswer[] = querySnap.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    } as UserAnswer));

                    // Update Feedback state with fetched data
                    setFeedback(interviewData);
                } catch (error) {
                    console.log("Error fetching Feedback:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchInterview();
            fetchFeedback();
        }
    }, [interviewId, navigate, userId]);
    /**
     * Memoized calculation of overall rating
     * Calculates average rating from all Feedback items
     * Returns 0.0 if no Feedback exists
     */
    const overAllRating = useMemo(() => {
        if (Feedback.length === 0) return 0.0;
        const totalRating = Feedback.reduce(
            (acc, curr) => acc + curr.rating, 0);
        return (totalRating / Feedback.length).toFixed(1);
    }, [Feedback]);

    if (isLoading) {
        return <LoaderPage className="w-full h-[70vh]" />;
    }

    return <div className="flex flex-col w-full gap-8 py-5">
        <div className="flex items-center justify-between w-full gap-2 ">
            <CustomBreadCrumb
                breadCrumbPage={"Feedback"}
                breadCrumbItems={[
                    { 
                        label: interview?.position || "", 
                        link: `/generate/interview/${interviewId}`
                    },
                ]}
            />
        </div>
        <Headings
            title='Feedback Summary'
            description='Detailed Feedback on your interview performance'
        />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <span className='bg-white/50 border border-gray-200 p-4 rounded-lg flex flex-col gap-2'>
                {overAllRating}/10
            </span>
        </div>
        {interview && <InterviewPin interview={interview} onMockPage />}
        
        <Headings title="Interview Feedback" isSubheading/>
        {Feedback && ( 
            <Accordion type="single" collapsible className="w-full">
                {Feedback.map((feed) => ( 
                    <AccordionItem 
                        key={feed.id} 
                        value={feed.id}
                        className='border border-gray-200 rounded-lg mb-2'
                    >
                        <AccordionTrigger
                            onClick={() => setActiveFeed(activeFeed === feed.id ? "" : feed.id)}
                            className='bg-gray-100 hover:bg-gray-200'
                        >
                            {/* Add content for the trigger */}
                            Question {Feedback.indexOf(feed) + 1}
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="p-4 bg-gray-50 rounded-lg shadow-md">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 font-medium">Question:</p>
                                    <p className="text-base text-gray-800 font-semibold">{feed.question}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 font-medium">Your Answer:</p>
                                    <p className="text-base text-gray-800">{feed.user_ans || "No answer provided"}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 font-medium">Feedback:</p>
                                    <p className="text-base text-gray-800">{feed.feedback || "No feedback available"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Rating:</p>
                                    <p className="text-base text-gray-800 font-bold">{feed.rating || "N/A"}/10</p>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        )}
    </div>;
};

export default Feedback;

