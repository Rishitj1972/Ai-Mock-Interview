import Header from "@/components/header";
import Footer from "@/components/footer";
import { Outlet } from 'react-router'


const AuthenticationLayout = () => {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col min-h-screen relative">
      <Header />
      <div className="flex-grow flex items-center justify-center relative">
        <img src='/assets/img/bg.png' 
            className='absolute w-full h-full object-cover opacity-20 pointer-events-none select-none'
            alt=''
        />
        <Outlet/>
      </div>
      <Footer />
    </div>
  )
}

export default AuthenticationLayout