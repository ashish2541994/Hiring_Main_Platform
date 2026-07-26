import { Outlet } from 'react-router-dom'
import Navbar from '../layout/Navbar'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
