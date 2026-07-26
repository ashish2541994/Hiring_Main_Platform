import CompanyRepository from '../repositories/CompanyRepository.js'
import UserRepository from '../repositories/UserRepository.js'
import bcrypt from 'bcrypt'

class CompanyService {
  async createCompany(companyData, userId) {
    const existingCompany = await CompanyRepository.findAll({ name: companyData.name })
    if (existingCompany.companies.length > 0) {
      throw new Error('Company with this name already exists')
    }

    const company = await CompanyRepository.create({
      ...companyData,
      slug: this.generateSlug(companyData.name),
      createdBy: userId,
    })

    // Update user with company ID
    await UserRepository.update(userId, { companyId: company._id })

    return company
  }

  async updateCompany(companyId, updateData, userId) {
    const existingCompany = await CompanyRepository.findById(companyId)
    if (!existingCompany) {
      throw new Error('Company not found')
    }

    const user = await UserRepository.findById(userId)
    if (!user || user.companyId.toString() !== companyId.toString()) {
      throw new Error('Unauthorized to update this company')
    }

    if (updateData.name) {
      updateData.slug = this.generateSlug(updateData.name)
    }

    const updatedCompany = await CompanyRepository.update(companyId, updateData)
    return updatedCompany
  }

  async deleteCompany(companyId, userId) {
    const existingCompany = await CompanyRepository.findById(companyId)
    if (!existingCompany) {
      throw new Error('Company not found')
    }

    const user = await UserRepository.findById(userId)
    if (!user || user.companyId.toString() !== companyId.toString()) {
      throw new Error('Unauthorized to delete this company')
    }

    await CompanyRepository.delete(companyId)
    return { success: true }
  }

  async getCompanyById(companyId) {
    const company = await CompanyRepository.findById(companyId)
    if (!company) {
      throw new Error('Company not found')
    }
    return company
  }

  async getCompanyBySlug(slug) {
    const company = await CompanyRepository.findBySlug(slug)
    if (!company) {
      throw new Error('Company not found')
    }
    return company
  }

  async getCompanies(filters = {}, options = {}) {
    return await CompanyRepository.findAll(filters, options)
  }

  async searchCompanies(query, filters = {}, options = {}) {
    return await CompanyRepository.search(query, filters, options)
  }

  async getCompanyJobs(companyId, options = {}) {
    return await CompanyRepository.getJobs(companyId, options)
  }

  async getCompanyTeam(companyId, options = {}) {
    return await CompanyRepository.getTeamMembers(companyId, options)
  }

  async addTeamMember(companyId, memberData, userId) {
    const company = await CompanyRepository.findById(companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    const user = await UserRepository.findById(userId)
    if (!user || user.companyId.toString() !== companyId.toString()) {
      throw new Error('Unauthorized to add team members')
    }

    // Create user account for team member
    const hashedPassword = await bcrypt.hash(memberData.password || 'defaultPassword123', 10)
    const teamMember = await UserRepository.create({
      ...memberData,
      password: hashedPassword,
      companyId,
      role: memberData.role || 'recruiter',
    })

    return teamMember
  }

  async removeTeamMember(companyId, memberId, userId) {
    const company = await CompanyRepository.findById(companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    const user = await UserRepository.findById(userId)
    if (!user || user.companyId.toString() !== companyId.toString()) {
      throw new Error('Unauthorized to remove team members')
    }

    await UserRepository.delete(memberId)
    return { success: true }
  }

  async updateTeamMemberRole(companyId, memberId, role, userId) {
    const company = await CompanyRepository.findById(companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    const user = await UserRepository.findById(userId)
    if (!user || user.companyId.toString() !== companyId.toString()) {
      throw new Error('Unauthorized to update team member roles')
    }

    await UserRepository.update(memberId, { role })
    return { success: true }
  }

  async addCompanyReview(companyId, reviewData, userId) {
    const company = await CompanyRepository.findById(companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    const review = await CompanyRepository.addReview(companyId, {
      ...reviewData,
      userId,
    })

    return review
  }

  async updateCompanyReview(companyId, reviewId, updateData, userId) {
    const company = await CompanyRepository.findById(companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    const review = await CompanyRepository.updateReview(companyId, reviewId, updateData)
    return review
  }

  async deleteCompanyReview(companyId, reviewId, userId) {
    const company = await CompanyRepository.findById(companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    await CompanyRepository.deleteReview(companyId, reviewId)
    return { success: true }
  }

  async getCompanyReviews(companyId, options = {}) {
    return await CompanyRepository.getReviews(companyId, options)
  }

  async followCompany(companyId, userId) {
    const company = await CompanyRepository.findById(companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    const user = await UserRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    return { success: true }
  }

  async unfollowCompany(companyId, userId) {
    const company = await CompanyRepository.findById(companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    const user = await UserRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    return { success: true }
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 50)
  }
}

export default new CompanyService()
