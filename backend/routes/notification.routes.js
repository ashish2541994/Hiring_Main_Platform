import express from 'express'
import Notification from '../models/Notification.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/notifications
// @desc    Get all notifications for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query

    const query = { recipient: req.user.id }

    if (unreadOnly === 'true') {
      query.read = false
    }

    const notifications = await Notification.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({ recipient: req.user.id, read: false })

    res.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    })

    res.json({ success: true, unreadCount: count })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this notification' })
    }

    notification.read = true
    notification.readAt = new Date()
    await notification.save()

    res.json({ success: true, message: 'Notification marked as read' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true, readAt: new Date() }
    )

    res.json({ success: true, message: 'All notifications marked as read' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this notification' })
    }

    await notification.deleteOne()

    res.json({ success: true, message: 'Notification deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   DELETE /api/notifications
// @desc    Delete all notifications
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user.id })

    res.json({ success: true, message: 'All notifications deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
