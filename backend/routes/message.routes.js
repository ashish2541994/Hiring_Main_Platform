import express from 'express'
import Message from '../models/Message.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/messages
// @desc    Get all conversations
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user.id },
            { receiver: req.user.id },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user.id] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', req.user.id] },
                    { $eq: ['$read', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          user: {
            id: '$user._id',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            email: '$user.email',
            avatar: '$user.avatar',
          },
          lastMessage: 1,
          unreadCount: 1,
        },
      },
    ])

    res.json({ success: true, conversations })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   GET /api/messages/:userId
// @desc    Get conversation with specific user
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 50 } = req.query

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    })
      .populate('sender', 'firstName lastName avatar')
      .populate('receiver', 'firstName lastName avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: 1 })

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: req.user.id, read: false },
      { read: true, readAt: new Date() }
    )

    res.json({ success: true, messages })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { receiver, content, job, application } = req.body

    const message = await Message.create({
      sender: req.user.id,
      receiver,
      content,
      job,
      application,
    })

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName avatar')
      .populate('receiver', 'firstName lastName avatar')

    // TODO: Emit socket event for real-time messaging

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to mark this message' })
    }

    message.read = true
    message.readAt = new Date()
    await message.save()

    res.json({ success: true, message: 'Message marked as read' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
