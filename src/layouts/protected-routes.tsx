import LoaderPage from "@/routes/loader-page"
import { useAuth } from "@clerk/clerk-react"
import { Navigate } from "react-router"

const ProtectedRoutes = ({children} : {children : React.ReactNode}) => {

    const {isLoaded, isSignedIn} = useAuth()

    if(!isLoaded) {
        return <LoaderPage/> 
        {/* <LoaderPage /> is shown while the auth state is loading */}
    }

    if(!isSignedIn) {
        return <Navigate to={"/sign-in"} replace/>
        {/* <Navigate /> is shown when the user is not signed in */}
    }

  return children;
}

export default ProtectedRoutes