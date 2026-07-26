import UserRepository from '../repositories/UserRepository.js'
import JobRepository from '../repositories/JobRepository.js'
import CompanyRepository from '../repositories/CompanyRepository.js'
import ApplicationRepository from '../repositories/ApplicationRepository.js'

class AdminService {
  async getPlatformStats() {
    const totalUsers = await UserRepository.findAll({}).then(result => result.total)
    const totalJobs = await JobRepository.findAll({}).then(result => result.total)
    const totalCompanies = await CompanyRepository.findAll({}).then(result => result.total)
    const totalApplications = await ApplicationRepository.findAll({}).then(result => result.total)

    const activeUsers = await UserRepository.findAll({ isActive: true }).then(result => result.total)
    const activeJobs = await JobRepository.findAll({ isActive: true }).then(result => result.total)

    const usersByRole = {
      candidates: await UserRepository.findByRole('candidate').then(result => result.total),
      recruiters: await UserRepository.findByRole('recruiter').then(result => result.total),
      admins: await UserRepository.findByRole('admin').then(result => result.total),
    }

    return {
      totalUsers,
      totalJobs,
      totalCompanies,
      totalApplications,
      activeUsers,
      activeJobs,
      usersByRole,
    }
  }

  async getAnalytics(filters = {}) {
    const stats = await this.getPlatformStats()
    
    const applicationStats = await ApplicationRepository.getStatistics({})
    const jobStats = await JobRepository.findAll({}).then(result => ({
      total: result.total,
      byType: this._groupByType(result.jobs),
    }))

    return {
      ...stats,
      applicationStats,
      jobStats,
    }
  }

  async getAllUsers(filters = {}, options = {}) {
    return await UserRepository.findAll(filters, options)
  }

  async updateUser(userId, updateData) {
    const user = await UserRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser = await UserRepository.update(userId, updateData)
    return updatedUser
  }

  async deleteUser(userId) {
    const user = await UserRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    if (user.role === 'admin') {
      throw new Error('Cannot delete admin users')
    }

    await UserRepository.delete(userId)
    return { success: true }
  }

  async activateUser(userId) {
    await UserRepository.update(userId, { isActive: true })
    return { success: true }
  }

  async deactivateUser(userId) {
    const user = await UserRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    if (user.role === 'admin') {
      throw new Error('Cannot deactivate admin users')
    }

    await UserRepository.update(userId, { isActive: false })
    return { success: true }
  }

  async verifyUser(userId) {
    await UserRepository.update(userId, { isVerified: true })
    return { success: true }
  }

  async getAllJobs(filters = {}, options = {}) {
    return await JobRepository.findAll(filters, options)
  }

  async deleteJob(jobId) {
    await JobRepository.delete(jobId)
    return { success: true }
  }

  async getAllCompanies(filters = {}, options = {}) {
    return await CompanyRepository.findAll(filters, options)
  }

  async deleteCompany(companyId) {
    await CompanyRepository.delete(companyId)
    return { success: true }
  }

  async getAllApplications(filters = {}, options = {}) {
    return await ApplicationRepository.findAll(filters, options)
  }

  async getSystemSettings() {
    return {
      platformName: 'Wind Hire',
      supportEmail: 'support@windhire.com',
      maintenanceMode: false,
    }
  }

  async updateSystemSettings(settingsData) {
    return { success: true }
  }

  async getActivityLogs(filters = {}, options = {}) {
    return { logs: [], total: 0, page: 1, limit: 10 }
  }

  async exportData(type, filters = {}) {
    let data = []
    let filename = ''

    switch (type) {
      case 'users':
        const users = await UserRepository.findAll(filters, { limit: 1000 })
        data = users.users
        filename = 'users-export.json'
        break
      case 'jobs':
        const jobs = await JobRepository.findAll(filters, { limit: 1000 })
        data = jobs.jobs
        filename = 'jobs-export.json'
        break
      case 'applications':
        const applications = await ApplicationRepository.findAll(filters, { limit: 1000 })
        data = applications.applications
        filename = 'applications-export.json'
        break
      default:
        throw new Error('Invalid export type')
    }

    return { data, filename }
  }

  _groupByType(jobs) {
    const grouped = {}
    jobs.forEach(job => {
      grouped[job.type] = (grouped[job.type] || 0) + 1
    })
    return grouped
  }
}

export default new AdminService()
