// Business services export
import JobService from './JobService'
import CandidateService from './CandidateService'
import RecruiterService from './RecruiterService'
import CompanyService from './CompanyService'
import AdminService from './AdminService'

const businessServices = {
  jobs: JobService,
  candidate: CandidateService,
  recruiter: RecruiterService,
  company: CompanyService,
  admin: AdminService,
}

export default businessServices

// Individual exports for convenience
export {
  JobService,
  CandidateService,
  RecruiterService,
  CompanyService,
  AdminService,
}
