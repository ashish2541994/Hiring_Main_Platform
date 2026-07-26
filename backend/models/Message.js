import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required'],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver is required'],
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  read: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
}, {
  timestamps: true,
})

// Index for conversation queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 })
messageSchema.index({ receiver: 1, read: 1 })

export default mongoose.model('Message', messageSchema)
