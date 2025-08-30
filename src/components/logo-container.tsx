import { Link } from "react-router"

const LogoContainer = () => {
  return (
    <Link to={"/"}>
        <img 
        src="/assets/svg/logo2.png" 
        alt="logo" 
        className="w-25 h-12 object-contain"
        />
        
    </Link>
  )
}

export default LogoContainer 