import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from '../ui/Loader'
import { USER_ROLES } from '../../constants/constants'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== USER_ROLES.ADMIN && user?.role !== 'super_admin') {
    return <Navigate to="/401" replace />
  }

  return children
}

export default AdminRoute
