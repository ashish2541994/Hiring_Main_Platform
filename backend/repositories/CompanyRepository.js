import Company from '../models/Company.js'
import JobRepository from './JobRepository.js'
import UserRepository from './UserRepository.js'
import User from '../models/User.js'

class CompanyRepository {
  async findById(id) {
    return await Company.findById(id)
  }

  async findBySlug(slug) {
    return await Company.findOne({ slug })
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options
    const skip = (page - 1) * limit

    const query = this._buildQuery(filters)
    const companies = await Company.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const total = await Company.countDocuments(query)

    return { companies, total, page, limit }
  }

  async create(companyData) {
    const company = new Company(companyData)
    return await company.save()
  }

  async update(id, updateData) {
    return await Company.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
  }

  async delete(id) {
    return await Company.findByIdAndDelete(id)
  }

  async search(query, filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options
    const skip = (page - 1) * limit

    const searchRegex = new RegExp(query, 'i')
    const searchQuery = {
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { industry: searchRegex },
      ],
    }

    const filterQuery = this._buildQuery(filters)
    const finalQuery = { ...searchQuery, ...filterQuery }

    const companies = await Company.find(finalQuery)
      .skip(skip)
      .limit(limit)

    const total = await Company.countDocuments(finalQuery)

    return { companies, total, page, limit }
  }

  async getJobs(companyId, options = {}) {
    return await JobRepository.findByCompany(companyId, options)
  }

  async getTeamMembers(companyId, options = {}) {
    const { page = 1, limit = 10 } = options
    const skip = (page - 1) * limit

    const users = await User.find({ companyId })
      .select('-password')
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments({ companyId })

    return { users, total, page, limit }
  }

  async getReviews(companyId, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options
    const skip = (page - 1) * limit

    const company = await Company.findById(companyId)
    if (!company || !company.reviews) {
      return { reviews: [], total: 0, page, limit }
    }

    const reviews = company.reviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + limit)

    const total = company.reviews.length

    return { reviews, total, page, limit }
  }

  async addReview(companyId, reviewData) {
    const company = await Company.findById(companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    if (!company.reviews) {
      company.reviews = []
    }

    company.reviews.push({
      ...reviewData,
      createdAt: new Date(),
    })

    const totalRating = company.reviews.reduce((sum, review) => sum + review.rating, 0)
    company.rating = totalRating / company.reviews.length

    return await company.save()
  }

  async updateReview(companyId, reviewId, updateData) {
    const company = await Company.findById(companyId)
    if (!company || !company.reviews) {
      throw new Error('Company or reviews not found')
    }

    const reviewIndex = company.reviews.findIndex(
      (review) => review._id.toString() === reviewId
    )

    if (reviewIndex === -1) {
      throw new Error('Review not found')
    }

    company.reviews[reviewIndex] = {
      ...company.reviews[reviewIndex],
      ...updateData,
      updatedAt: new Date(),
    }

    const totalRating = company.reviews.reduce((sum, review) => sum + review.rating, 0)
    company.rating = totalRating / company.reviews.length

    return await company.save()
  }

  async deleteReview(companyId, reviewId) {
    const company = await Company.findById(companyId)
    if (!company || !company.reviews) {
      throw new Error('Company or reviews not found')
    }

    company.reviews = company.reviews.filter(
      (review) => review._id.toString() !== reviewId
    )

    if (company.reviews.length > 0) {
      const totalRating = company.reviews.reduce((sum, review) => sum + review.rating, 0)
      company.rating = totalRating / company.reviews.length
    } else {
      company.rating = 0
    }

    return await company.save()
  }

  _buildQuery(filters) {
    const query = {}

    if (filters.industry) {
      query.industry = filters.industry
    }

    if (filters.size) {
      query.size = filters.size
    }

    if (filters.location) {
      query.location = new RegExp(filters.location, 'i')
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive
    }

    if (filters.isVerified !== undefined) {
      query.isVerified = filters.isVerified
    }

    if (filters.ratingMin) {
      query.rating = { $gte: filters.ratingMin }
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

export default new CompanyRepository()
