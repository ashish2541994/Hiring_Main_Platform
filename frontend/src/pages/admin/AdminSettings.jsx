import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Button from '../../components/ui/Button'

const AdminSettings = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Platform configuration
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input label="Platform Name" defaultValue="Wind Hire" />
            <Input label="Support Email" defaultValue="support@windhire.com" />
            <Textarea label="Terms of Service" placeholder="Enter terms of service..." rows={6} />
            <Button>Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminSettings
