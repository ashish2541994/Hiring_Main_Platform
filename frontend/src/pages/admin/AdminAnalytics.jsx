import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const AdminAnalytics = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Platform performance metrics
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Analytics and reporting features coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminAnalytics
