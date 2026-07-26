import Notification from '../models/Notification.js'

class NotificationRepository {
  async findById(id) {
    return await Notification.findById(id).populate('userId')
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options
    const skip = (page - 1) * limit

    const query = this._buildQuery(filters)
    const notifications = await Notification.find(query)
      .populate('userId')
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const total = await Notification.countDocuments(query)

    return { notifications, total, page, limit }
  }

  async create(notificationData) {
    const notification = new Notification(notificationData)
    return await notification.save()
  }

  async update(id, updateData) {
    return await Notification.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('userId')
  }

  async delete(id) {
    return await Notification.findByIdAndDelete(id)
  }

  async findByUser(userId, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options
    const skip = (page - 1) * limit

    const notifications = await Notification.find({ userId })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const total = await Notification.countDocuments({ userId })

    return { notifications, total, page, limit }
  }

  async findUnreadByUser(userId, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options
    const skip = (page - 1) * limit

    const notifications = await Notification.find({ userId, read: false })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const total = await Notification.countDocuments({ userId, read: false })

    return { notifications, total, page, limit }
  }

  async markAsRead(id) {
    return await Notification.findByIdAndUpdate(
      id,
      { $set: { read: true, readAt: new Date() } },
      { new: true }
    )
  }

  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true, readAt: new Date() } }
    )
  }

  async deleteAll(userId) {
    return await Notification.deleteMany({ userId })
  }

  async deleteRead(userId) {
    return await Notification.deleteMany({ userId, read: true })
  }

  async getUnreadCount(userId) {
    return await Notification.countDocuments({ userId, read: false })
  }

  async findByType(userId, type, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options
    const skip = (page - 1) * limit

    const notifications = await Notification.find({ userId, type })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const total = await Notification.countDocuments({ userId, type })

    return { notifications, total, page, limit }
  }

  async createBulk(notificationsData) {
    return await Notification.insertMany(notificationsData)
  }

  async deleteOld(daysOld = 30) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    return await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      read: true,
    })
  }

  _buildQuery(filters) {
    const query = {}

    if (filters.userId) {
      query.userId = filters.userId
    }

    if (filters.type) {
      query.type = filters.type
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

export default new NotificationRepository()
