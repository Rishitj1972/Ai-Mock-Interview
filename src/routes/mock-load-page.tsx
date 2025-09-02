import { db } from "@/config/firebase.config";
import type { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import LoaderPage from "./loader-page";
import CustomBreadCrumb from "@/components/custom-bread-crumb";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkle } from "lucide-react";
import InterviewPin from "@/components/pin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const MockLoadPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null); // state to hold interview data the Interview types from type folder
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  if (!interviewId) {
    navigate("/generate", { replace: true }); // this will redirect to the generate page if interviewId is not present
  }

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        if (interviewId) {
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

  return <div className="flex flex-col w-full gap-8 py-5 ">
    <div className="flex items-center justify-between w-full gap-2 ">
        
        {/* BreadCrumps to navigate  */}
        <CustomBreadCrumb
        breadCrumbPage={interview?.position || ""}
        breadCrumbItems={[{label : "Mock Interview" , link : "/generate"}]}
        /> 

        {/* Button to start Interview */}
        <Link to={`/generate/interview/${interviewId}/start`}>
            <Button size={"sm"}>
                Start <Sparkle/>
            </Button>
        </Link>
    </div>
    {interview && <InterviewPin interview ={interview} onMockPage/>}

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
  </div>;
};

export default MockLoadPage;
