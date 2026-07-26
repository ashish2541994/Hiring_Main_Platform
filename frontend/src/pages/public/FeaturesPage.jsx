import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const FeaturesPage = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Features</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need for your job search or hiring process.
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our features page is under construction. Check back soon for detailed information about all our features.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FeaturesPage
