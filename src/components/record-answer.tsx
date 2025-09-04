import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import useSpeechToText, { type ResultType }  from 'react-hook-speech-to-text';
import { useParams } from 'react-router';
import { TooltipButton } from './tooltip-button';
import { CircleStop, Loader, Mic, RefreshCw, Save } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/scripts';

interface RecordAnswerProps {
    question : {question: string; answer: string};
}

interface AIResponse {
    rating : number;
    feedback: string;
}

const RecordAnswer = ({question} : RecordAnswerProps) => {
     const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating,setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open,setOpen] = useState(false);
  const [loading,setLoading] = useState(false);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  const recordUserAnswer = async  () => {
     if(isRecording) {
        stopSpeechToText();

        if(userAnswer.length < 20) {
            toast.error("Error",{
                description: "Your answer should be more than 20 characters",
            })
            return;
        }
        // ai result
        const aiResult = await generateResult(
            question.question,
            question.answer,
            userAnswer
        );
        setAiResult(aiResult);
        console.log("AI Feedback:", aiResult);
        console.log("USer Answer : ",userAnswer);
     } else {
        startSpeechToText();
     }
  };

  const cleanJsonResponse = (responseText: string) => {
    // trim any surrounding whitespaces
    let cleanText = responseText.trim();

    cleanText = cleanText.replace(/```json|```|json |'''|'/g, "");
    cleanText = cleanText.trim();
     
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error(
        `Failed to parse JSON array: ${(error as Error).message}`
      );
    }
  };

//  this will generate result
  const generateResult = async (
    qst : string,
    qstAns : string,
    userAns : string
  ) : Promise<AIResponse> => {
    setIsAiGenerating(true);
    const prompt = `
    Question: "${qst}""
    User Answer: "${userAns}"
    Correct Answer: "${qstAns}"
    Please compare the user's answer to the correct answer, ans provide a rating( from 1 to 10 ) based on 
    answer quality,and offer feedback for improvement. Return the result in JSON format with the fields "ratings" 
    (number) and "feedback" string.`;

    try {
        const aiResult = await chatSession.sendMessage(prompt);
        const parsedResult : AIResponse = cleanJsonResponse(
            aiResult.response.text()
        );
        return parsedResult;

    } catch (error) {
        console.log(error);
        toast("Error",{
            description: "An error occurred while generating feedback.",
        });
        return { rating: 0, feedback: "Unable to generate feedback"};
    } finally {
        setIsAiGenerating(false);
    }
  }

  const recordNewAnswer = () => {
    setUserAnswer("");
    stopSpeechToText();
    startSpeechToText();
  }

//   to store the ai result

  useEffect(() => {
    const combineTranscripts = results.filter((result) : result is ResultType => typeof result  !== "string" )
    .map(result => result.transcript).join(" ");

    setUserAnswer(combineTranscripts);
  },[results]);        

  return (<>
    <div className='w-full flex flex-row items-center justify-center gap-8 mt-4'>
        <TooltipButton
        content={isRecording ? "Stop Recording" : "Start Recording"}
        icon={
            isRecording ? (
                <CircleStop className='min-w-5 min-h-5'/>
            ) : (<Mic className='min-w-5 min-h-5'/>)
        }
        onClick={recordUserAnswer}
        />
        <TooltipButton 
        content='Record Again'
        icon={<RefreshCw className='min-w-5 min-h-5' />}
        onClick={recordNewAnswer}
        />
        <TooltipButton
        content='Save Result'
        icon={
            isAiGenerating ? (
                <Loader className='min-w-5 min-h-5 animate-spin'/>
            ) : (
                <Save className='min-w-5 min-h-5'/>
            )
        }
        onClick={() => setOpen(!open)}
        disbaled={!aiResult}
        />
    </div>
    <div className='w-full mt-14 p-4 border rounded-md bg-gray-50'>
        <h2 className='text-lg font-semibold'>Your Answer:</h2>
        <textarea
          className='text-sm mt-2 text-gray-700 whitespace-normal w-full p-2 rounded border '
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          rows={4}
          placeholder='Start recording to see your answer or edit here...'
        />
        {interimResult && (
            <p className='text-sm text-gray-500 mt-2'>
                <strong>Current Speech:</strong>
                {interimResult}
            </p>
        )}
    </div>
    </>
  )
}

export default RecordAnswer