import User from '../models/User.js'

class UserRepository {
  async findById(id) {
    return await User.findById(id).select('-password')
  }

  async findByEmail(email) {
    return await User.findOne({ email })
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options
    const skip = (page - 1) * limit

    const query = this._buildQuery(filters)
    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments(query)

    return { users, total, page, limit }
  }

  async create(userData) {
    const user = new User(userData)
    return await user.save()
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password')
  }

  async delete(id) {
    return await User.findByIdAndDelete(id)
  }

  async updatePassword(id, hashedPassword) {
    return await User.findByIdAndUpdate(
      id,
      { $set: { password: hashedPassword } },
      { new: true }
    )
  }

  async findByRole(role, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options
    const skip = (page - 1) * limit

    const users = await User.find({ role })
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments({ role })

    return { users, total, page, limit }
  }

  async search(query, options = {}) {
    const { page = 1, limit = 10 } = options
    const skip = (page - 1) * limit

    const searchRegex = new RegExp(query, 'i')
    const users = await User.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ],
    })
      .select('-password')
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ],
    })

    return { users, total, page, limit }
  }

  _buildQuery(filters) {
    const query = {}

    if (filters.role) {
      query.role = filters.role
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive
    }

    if (filters.isVerified !== undefined) {
      query.isVerified = filters.isVerified
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

export default new UserRepository()
