import { db } from "@/config/firebase.config";
import type { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import LoaderPage from "./loader-page";
import CustomBreadCrumb from "@/components/custom-bread-crumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb } from "lucide-react";
import  { QuestionSection } from "@/components/question-section";

const MockInterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

 useEffect(() => {
    const fetchInterview = async () => {
      try {
        if (interviewId) {
          console.log(interviewId)
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId)); // fetching the interview from firestore
          if (interviewDoc.exists()) {
            setInterview({
              id: interviewDoc.id,
              ...interviewDoc.data(),
            } as Interview); // setting the interview data to state
          }
        }
      } catch (error) {
        console.log("Error fetching interview:", error);
      }
    };
    fetchInterview(); // calling the fetchInterview function which fetches the interview data when the component mounts or interviewId changes
  }, [interviewId, navigate]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }

  if (!interview) {
    navigate("/generate", { replace: true });
  }

  return (
  <div className="flex flex-col w-full gap-8 py-5">
    <CustomBreadCrumb
        breadCrumbPage="Start"
        breadCrumbItems={[{label : "Mock Interview" , link : "/generate"},{label : interview?.position || "" , link : `/generate/${interview?.id}`}]}
        /> 

    <div className="w-full ">
        <Alert className="bg-indigo-100/50 border-indigo-200 p-4 rounded-lg flex items-start gap-3 -mt-3">
        <Lightbulb className="h-5 w-5 text-indigo-600" />
        <div>
          <AlertTitle className="text-indigo-800 font-semibold">
            Important Information
          </AlertTitle>
          <AlertDescription className="text-sm text-indigo-700 mt-1">
            Please enable your microphone to start the AI-generated
            mock interview.
            <br />
          </AlertDescription>
        </div>
      </Alert>
    </div>
    {interview?.questions && interview?.questions.length > 0 && (
        <div className="mt-4 w-full flex flex-col items-start gap-4">
          <QuestionSection questions={interview?.questions} />
        </div>
      )}
  </div>
  );
};

export default MockInterviewPage;
