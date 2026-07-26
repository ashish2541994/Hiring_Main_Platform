import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Users, Building2, TrendingUp, CheckCircle } from 'lucide-react'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'

const LandingPage = () => {
  const features = [
    {
      icon: Briefcase,
      title: 'Find Your Dream Job',
      description: 'Browse thousands of job opportunities from top companies worldwide.',
    },
    {
      icon: Users,
      title: 'Connect with Recruiters',
      description: 'Direct messaging with hiring managers and recruiters.',
    },
    {
      icon: Building2,
      title: 'Company Insights',
      description: 'Research companies, read reviews, and find the right culture fit.',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Track your applications and get personalized recommendations.',
    },
  ]

  const stats = [
    { value: '10K+', label: 'Active Jobs' },
    { value: '5K+', label: 'Companies' },
    { value: '100K+', label: 'Job Seekers' },
    { value: '95%', label: 'Success Rate' },
  ]

  const benefits = [
    'AI-powered job matching',
    'Real-time notifications',
    'Advanced search filters',
    'Company reviews',
    'Salary insights',
    'Resume builder',
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
              Find Your Next Career Move
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with top companies and discover opportunities that match your skills and ambitions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/candidate/jobs">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Wind Hire?</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to accelerate your career
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                For Job Seekers
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Take control of your job search with powerful tools designed to help you stand out.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              <Link to="/register" className="inline-block mt-8">
                <Button size="lg">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8">
                <div className="h-full rounded-xl bg-background/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-2">10K+</div>
                    <div className="text-xl">Jobs Available</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Find Your Next Role?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of professionals who have found their dream jobs through Wind Hire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/recruiter/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  For Recruiters
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
