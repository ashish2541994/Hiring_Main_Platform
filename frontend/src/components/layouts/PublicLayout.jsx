import { Outlet } from 'react-router-dom'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
