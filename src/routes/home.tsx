import { UserButton } from "@clerk/clerk-react"

const HomePage = () => {
  return (
    <div>Home Page
      <UserButton/> {/* User Profile Button from Clerk */}
    </div>
  )
}

export default HomePage