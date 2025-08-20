import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"

const LoaderPage = ({className} : {className ?: string}) => {
  return (
    <div className={cn( 
        "w-screen h-screen flex items-center justify-center bg-transparent z-50"
    )}> {/* cn is a utility function for conditional class names */}
    <Loader className="w-6 h-6 min-w-6 min-h-6 animate-spin"/> {/* <Loader /> icon from lucide-react by shadcn/ui */}
    </div>
  )
}

export default LoaderPage