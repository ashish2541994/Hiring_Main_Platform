import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required'],
  },
  type: {
    type: String,
    enum: ['application', 'message', 'job', 'system', 'profile'],
    required: [true, 'Notification type is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters'],
  },
  link: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
})

// Index for user notifications
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })

export default mongoose.model('Notification', notificationSchema)
