import Message from '../models/Message.js'

class MessageRepository {
  async findById(id) {
    return await Message.findById(id).populate('senderId conversationId')
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options
    const skip = (page - 1) * limit

    const query = this._buildQuery(filters)
    const messages = await Message.find(query)
      .populate('senderId')
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const total = await Message.countDocuments(query)

    return { messages, total, page, limit }
  }

  async create(messageData) {
    const message = new Message(messageData)
    return await message.save()
  }

  async update(id, updateData) {
    return await Message.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('senderId conversationId')
  }

  async delete(id) {
    return await Message.findByIdAndDelete(id)
  }

  async findByConversation(conversationId, options = {}) {
    const { page = 1, limit = 50, sort = { createdAt: 1 } } = options
    const skip = (page - 1) * limit

    const messages = await Message.find({ conversationId })
      .populate('senderId')
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const total = await Message.countDocuments({ conversationId })

    return { messages, total, page, limit }
  }

  async findBySender(senderId, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options
    const skip = (page - 1) * limit

    const messages = await Message.find({ senderId })
      .populate('conversationId')
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const total = await Message.countDocuments({ senderId })

    return { messages, total, page, limit }
  }

  async markAsRead(conversationId, userId) {
    return await Message.updateMany(
      { conversationId, senderId: { $ne: userId }, read: false },
      { $set: { read: true, readAt: new Date() } }
    )
  }

  async markAsReadById(messageId) {
    return await Message.findByIdAndUpdate(
      messageId,
      { $set: { read: true, readAt: new Date() } },
      { new: true }
    )
  }

  async getUnreadCount(userId) {
    return await Message.countDocuments({
      senderId: { $ne: userId },
      read: false,
    })
  }

  async getUnreadCountByConversation(conversationId, userId) {
    return await Message.countDocuments({
      conversationId,
      senderId: { $ne: userId },
      read: false,
    })
  }

  async search(conversationId, query, options = {}) {
    const { page = 1, limit = 20 } = options
    const skip = (page - 1) * limit

    const searchRegex = new RegExp(query, 'i')
    const messages = await Message.find({
      conversationId,
      content: searchRegex,
    })
      .populate('senderId')
      .skip(skip)
      .limit(limit)

    const total = await Message.countDocuments({
      conversationId,
      content: searchRegex,
    })

    return { messages, total, page, limit }
  }

  async getConversationStats(conversationId) {
    const total = await Message.countDocuments({ conversationId })
    const unread = await Message.countDocuments({ conversationId, read: false })
    const lastMessage = await Message.findOne({ conversationId })
      .sort({ createdAt: -1 })

    return { total, unread, lastMessage }
  }

  _buildQuery(filters) {
    const query = {}

    if (filters.conversationId) {
      query.conversationId = filters.conversationId
    }

    if (filters.senderId) {
      query.senderId = filters.senderId
    }

    if (filters.read !== undefined) {
      query.read = filters.read
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {}
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate)
      }
    }

    return query
  }
}

export default new MessageRepository()
