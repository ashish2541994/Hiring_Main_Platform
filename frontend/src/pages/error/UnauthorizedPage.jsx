import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Home } from 'lucide-react'
import Button from '../../components/ui/Button'

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
          <Shield className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You don't have permission to access this page.
        </p>
        <Link to="/">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

export default UnauthorizedPage
