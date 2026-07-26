import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const AboutPage = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">About Wind Hire</h1>
          <p className="text-xl text-muted-foreground">
            Revolutionizing the way people find jobs and companies hire talent.
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Wind Hire is dedicated to connecting talented individuals with opportunities that match their skills and aspirations. We believe that everyone deserves to find meaningful work, and every company deserves to find the right talent.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AboutPage
