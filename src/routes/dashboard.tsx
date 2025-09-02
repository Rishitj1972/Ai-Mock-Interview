import Headings from "@/components/headings"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/config/firebase.config"
import type { Interview } from "@/types"
import { useAuth } from "@clerk/clerk-react"
import { Separator } from "@radix-ui/react-separator"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { toast } from "sonner"
import { set } from "zod"

const Dashboard = () => {

    const [interviews,setInterviews] = useState<Interview[]>([])  // State to hold interviews
    const [loading, setLoading] = useState(false); 
    const {userId} = useAuth();

    useEffect(() => {
        setLoading(true);
        const interviewQuery = query(
            collection(db,"interviews"),
            where("userId","==",userId)
        );

        const unsubscribe = onSnapshot(interviewQuery,(snapshot) => {
            const interviewList : Interview[] = snapshot.docs.map((doc) => {
                const id = doc.id
                return {
                    id,
                    ...doc.data() 
                }
            }) as Interview[];

            setInterviews(interviewList);
            setLoading(false);
        },
            (error) => {
                console.error("Error fetching interviews: ", error);
                toast.error("Error...",{
                    description : "There was an error fetching your interviews. Please try again later."
                });
                setLoading(false);
            })

            return () => unsubscribe();
    },[userId])

  return <>
        <div className="flex w-full items-center justify-between">
            {/* headings */}
            {/* New component is created for headings inside the component folder */}
            <Headings
                title="Dashboard"
                description="Create and start your AI Mock Interview"
            />
            <Link to={"/generate/create"}>
                <Button size={"sm"}>
                    <Plus/>Add New
                </Button>
            </Link>
        </div>
        <Separator className="my-8"/>
        {/* content section */}
            <div className="md:grid md:grid-cols-3 gap-3 py-4">
                {loading ? Array.from({length : 6}).map((_,index) => (
                    <Skeleton key={index} className="h-24 md:h-32 rounded-md"/>
                )): interviews.length > 0 ? interviews.map((interview) => <p key={interview.id}>{interview.position}</p> ) :<div>No Data Found</div>}
            </div>
    </>
}

export default Dashboard