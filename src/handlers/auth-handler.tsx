import { db } from "@/config/firebase.config";
import LoaderPage from "@/routes/loader-page";
import type { User } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const AuthHandler = () => {

    const { isSignedIn } = useAuth(); // Get the authentication status
    const { user } = useUser(); // Get the user object

    const pathname = useLocation().pathname; // Get the current pathname
    const navigate = useNavigate(); // Get the navigate function

    const [loading, setLoading] = useState(false); // State to manage loading

    useEffect(() => { // Effect to handle authentication
        const storeUserData = async () => {
            if(isSignedIn && user) {
            setLoading(true);
            try {
                const userSnap = await getDoc(doc(db, "users", user.id));
                if(!userSnap.exists()) {
                    const userData : User = {
                        id : user.id,
                        name : user.fullName || user.firstName || "Anonymous",
                        email : user.primaryEmailAddress?.emailAddress || "N/A",
                        imageUrl : user.imageUrl,
                        createdAt : serverTimestamp(),
                        updatedAt : serverTimestamp(),
                    };

                    await setDoc(doc(db, "users", user.id), userData);
                }
            } catch (error) {
                console.log("Error on storing user data : ",error);
            }
            finally {
                setLoading(false);
            }
        }
        }
        storeUserData();
    },[isSignedIn, user, pathname, navigate]);

    if(loading) { // If loading is true, show the loader
        return <LoaderPage/>
    }

    return null;
}

export default AuthHandler;