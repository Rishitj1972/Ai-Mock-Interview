import { MainRoutes } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";

interface NavigationRoutesProps {
  isMobile?: boolean;
}

const NavigationRoutes = ({ isMobile = false }: NavigationRoutesProps) => {
  return (
      <ul className={cn("flex items-center gap-6", isMobile && "items-start flex-col gap-8")}>
        {MainRoutes.map((route) => (
            <NavLink 
            key={route.path} 
            to={route.path} 
            className={({isActive}) => 
                cn(
                  "text-base text-neutral-600 transition-colors duration-200 hover:text-indigo-900 hover:bg-indigo-100 hover:rounded-lg px-3 py-1",
                  isActive && "text-neutral-900 font-semibold"
                )}>
                        {route.label}
                    </NavLink>
        ))}
      </ul>
  );
};

export default NavigationRoutes;
