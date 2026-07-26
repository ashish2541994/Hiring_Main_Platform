import jwtUtils from '../utils/jwtUtils.js'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' })
    }

    const verification = jwtUtils.verifyAccessToken(token)

    if (!verification.valid) {
      return res.status(401).json({ success: false, message: 'Token is invalid or expired' })
    }

    const user = await User.findById(verification.decoded.userId).select('-password')

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'User account is deactivated' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error in authentication' })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      })
    }
    next()
  }
}
