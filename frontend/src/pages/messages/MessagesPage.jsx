import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const MessagesPage = () => {
  const conversations = [
    {
      id: 1,
      name: 'John Doe',
      lastMessage: 'Thanks for the opportunity!',
      time: '2h ago',
      unread: 2,
    },
    {
      id: 2,
      name: 'Jane Smith',
      lastMessage: 'When can we schedule the interview?',
      time: '1d ago',
      unread: 0,
    },
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Your conversations
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <Avatar
                  initials={conv.name.split(' ').map(n => n[0]).join('')}
                  size="md"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{conv.name}</p>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MessagesPage
