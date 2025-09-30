import { Link } from "react-router"

const LogoContainer = () => {
  return (
    <Link to={"/"}>
        <img 
        src="/assets/svg/logo2.png" 
        alt="logo" 
        className="w-40 h-20 object-contain"
        />
        
    </Link>
  )
}

export default LogoContainer 