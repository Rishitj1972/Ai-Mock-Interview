import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NavigationRoutes from "./navigation-routes";
import { useAuth } from "@clerk/clerk-react";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils";

const ToggleContainer = () => {

    const {userId} = useAuth();

  return (
    <Sheet>
      <SheetTrigger className="block md:hidden"><Menu/></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
        </SheetHeader>
        <nav className="gap-6 flex flex-col items-start">
            <NavigationRoutes /> {/* Navigation Routes for mobile  */}
            {/* if the user is authenticated then display the protected routes */}
            {userId && (
              <NavLink 
            to={"/generate"} 
            className={({isActive}) => 
                cn("text-base text-neutral-600 mt-6", 
                    isActive && "text-neutral-900 font-semibold")}>
                        Take An Interview
                    </NavLink>
            )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default ToggleContainer;
