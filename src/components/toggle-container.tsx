import {
  Sheet,
  SheetContent,
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
  const { userId } = useAuth();

  return (
    <Sheet>
      <SheetTrigger className="block md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="gap-6 flex flex-col items-start mt-6">
          <NavigationRoutes />
          {/* Protected routes for authenticated users */}
          {userId && (
            <>
              <NavLink 
                to="/generate" 
                className={({ isActive }) => 
                  cn("text-base text-neutral-600 flex items-center gap-2", 
                      isActive && "text-neutral-900 font-semibold")
                }>
                Take An Interview
              </NavLink>
              
              <NavLink 
                to="/cv-review" 
                className={({ isActive }) => 
                  cn("text-base text-neutral-600 flex items-center gap-2", 
                      isActive && "text-neutral-900 font-semibold")
                }>
                CV Review
              </NavLink>
              
              <NavLink 
                to="/code-editor" 
                className={({ isActive }) => 
                  cn("text-base text-neutral-600 flex items-center gap-2", 
                      isActive && "text-neutral-900 font-semibold")
                }>
                Practice Problems
              </NavLink>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default ToggleContainer;
