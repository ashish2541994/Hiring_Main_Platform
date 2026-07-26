// Context providers export
import { NotificationProvider } from './NotificationContext'
import { ChatProvider } from './ChatContext'
import { ApplicationProvider } from './ApplicationContext'
import { JobProvider } from './JobContext'

const ContextProviders = ({ children }) => {
  return (
    <NotificationProvider>
      <ChatProvider>
        <ApplicationProvider>
          <JobProvider>
            {children}
          </JobProvider>
        </ApplicationProvider>
      </ChatProvider>
    </NotificationProvider>
  )
}

export default ContextProviders

// Individual exports for convenience
export {
  NotificationProvider,
  ChatProvider,
  ApplicationProvider,
  JobProvider,
}
