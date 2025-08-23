import { BrowserRouter as Router, Routes, Route } from "react-router";
import { PublicLayout } from "@/layouts/public-layout";
import HomePage from "@/routes/home";
import AuthenticationLayout from "@/layouts/auth-layout";
import SignInPage from "./routes/sign-in";
import SignUpPage from "./routes/sign-up";
import ProtectedRoutes from "./layouts/protected-routes";
import { MainLayout } from "./layouts/main-layout";
import Generate from "./components/generate";
import Dashboard from "./routes/dashboard";
import CreateEditPage from "./routes/create-edit-page";

const App = () => {
 return (
  <Router>
    <Routes>
      {/* Public Route */}
      <Route element={<PublicLayout/>}>
        <Route index element={<HomePage/>}/>
      </Route>

      {/* Authentication Layout */}
      <Route element={<AuthenticationLayout/>}>
        <Route path="/signin/*" element={<SignInPage/>}/>
        <Route path="/signup/*" element={<SignUpPage/>}/>
      </Route>

      {/* Protected ROute */}
      <Route element={<ProtectedRoutes>
        <MainLayout/> 
      </ProtectedRoutes>}>

      {/* add all the protected routes */} 
      <Route element={<Generate/>} path="/generate"> 
        <Route index element={<Dashboard/>}/>
        <Route path=":interviewId" element={<CreateEditPage/>}/>
      </Route>
      </Route>

    </Routes>
  </Router>
 );
}

export default App