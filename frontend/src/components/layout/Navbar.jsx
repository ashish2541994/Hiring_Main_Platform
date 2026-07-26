import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  MessageSquare, 
  User, 
  Moon, 
  Sun, 
  Globe,
  ChevronDown 
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import { cn } from '../../utils/cn'
import { getDashboardPath, getProfilePath } from '../../utils/auth'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const { user, isAuthenticated, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const jobsPath = isAuthenticated
        ? getDashboardPath(user?.role).replace('/dashboard', '/jobs')
        : '/candidate/jobs'
      navigate(`${jobsPath}?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const navLinks = isAuthenticated
    ? [
        { name: 'Dashboard', path: getDashboardPath(user?.role) },
        { name: 'Companies', path: '/companies' },
      ]
    : [
        { name: 'Find Jobs', path: '/candidate/jobs' },
        { name: 'Companies', path: '/companies' },
        { name: 'About', path: '/about' },
        { name: 'Pricing', path: '/pricing' },
      ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold gradient-text">Wind Hire</span>
            </motion.div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jobs, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent',
                  location.pathname === link.path ||
                    (link.path !== '/' && location.pathname.startsWith(link.path))
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link to="/notifications">
                  <Button variant="ghost" size="sm" className="p-2 relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </Button>
                </Link>

                {/* Messages */}
                <Link to="/messages">
                  <Button variant="ghost" size="sm" className="p-2 relative">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2"
                  >
                    <Avatar
                      src={user?.avatar}
                      initials={user?.firstName?.[0] + user?.lastName?.[0]}
                      size="sm"
                    />
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-background shadow-lg py-2"
                      >
                        <Link
                          to={getDashboardPath(user?.role)}
                          className="block px-4 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to={getProfilePath(user?.role)}
                          className="block px-4 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Settings
                        </Link>
                        <hr className="my-2 border-border" />
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsProfileDropdownOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>
              </form>

              {/* Mobile Nav Links */}
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'block px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      location.pathname === link.path
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:bg-accent'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="p-2"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>

                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <Avatar
                      src={user?.avatar}
                      initials={user?.firstName?.[0] + user?.lastName?.[0]}
                      size="sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button size="sm">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
