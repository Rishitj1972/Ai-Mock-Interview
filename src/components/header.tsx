import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import Container from "./container";
import LogoContainer from "./logo-container";
import NavigationRoutes from "./navigation-routes";
import { NavLink } from "react-router";
import ProfileContainer from "./profile-container";


const Header = () => {
  const { userId } = useAuth();

  return (
    <header
      className={cn("w-full bg-gradient-to-r from-blue-50 to-indigo-100 shadow-md  duration-150 transition-all ease-in-out")}
    >
      <Container>
        <div className="flex items-center gap-4 w-full py-1 px-2">
          {/* logo section */}
          <LogoContainer />
          {/* navigation section */}
          <nav className="hidden md:flex items-center gap-3">
            <NavigationRoutes />
            {/* if the user is authenticated then display the protected routes */}
            {userId && (
              <NavLink 
                to={"/generate"} 
                className={({isActive}) => 
                  cn(
                    "text-base text-neutral-600 transition-colors duration-200 hover:text-indigo-900 hover:bg-indigo-100 hover:rounded-lg px-3 py-1",
                    isActive && "text-neutral-900 font-semibold"
                  )}
              >
                Take An Interview
              </NavLink>
            )}
          </nav>
          <div className="ml-auto flex items-center gap-6">
            {/* Profile Section */}
            <ProfileContainer  />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
