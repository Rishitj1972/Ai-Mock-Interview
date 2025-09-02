import FormMockInterview from "@/components/form-mock-interview";
import { db } from "@/config/firebase.config";
import type { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const CreateEditPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>(); // this will give you the interviewId from the URL
  const [interview, setInterview] = useState<Interview | null>(null); // state to hold interview data the Interview types from type folder

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        if (interviewId) {
        const interviewDoc = await getDoc(doc(db,"interviews",interviewId)); // fetching the interview from firestore
        if(interviewDoc.exists()) {
            setInterview({id : interviewDoc.id,...interviewDoc.data()} as Interview) // setting the interview data to state
        }
      }
      } catch (error) {
        console.log("Error fetching interview:", error);
      }
    };
    fetchInterview(); // calling the fetchInterview function which fetches the interview data when the component mounts or interviewId changes
  }, [interviewId]);

  return <div className="my-4 flex-col w-full">
    <FormMockInterview initialData={interview} /> {/* This component will display the interview data */}
    </div>;
};

export default CreateEditPage;
