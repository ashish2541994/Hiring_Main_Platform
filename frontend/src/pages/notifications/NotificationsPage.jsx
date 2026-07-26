import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      title: 'Application Status Updated',
      message: 'Your application for Senior Frontend Developer has been shortlisted.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      title: 'New Job Match',
      message: 'A new job matching your profile has been posted.',
      time: '1 day ago',
      read: true,
    },
    {
      id: 3,
      title: 'Profile View',
      message: 'A recruiter viewed your profile.',
      time: '2 days ago',
      read: true,
    },
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your activity
          </p>
        </div>
        <Button variant="outline">Mark all as read</Button>
      </motion.div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  notification.read ? 'border-border bg-background' : 'border-primary/50 bg-primary/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotificationsPage
