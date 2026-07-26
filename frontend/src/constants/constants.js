export const USER_ROLES = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  CANDIDATE: 'candidate',
}

export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
  FREELANCE: 'freelance',
}

export const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
  EXECUTIVE: 'executive',
}

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  SHORTLISTED: 'shortlisted',
  INTERVIEWING: 'interviewing',
  OFFERED: 'offered',
  HIRED: 'hired',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
}

export const SALARY_RANGES = [
  { min: 0, max: 30000, label: '$0 - $30k' },
  { min: 30000, max: 50000, label: '$30k - $50k' },
  { min: 50000, max: 75000, label: '$50k - $75k' },
  { min: 75000, max: 100000, label: '$75k - $100k' },
  { min: 100000, max: 150000, label: '$100k - $150k' },
  { min: 150000, max: 200000, label: '$150k - $200k' },
  { min: 200000, max: 999999, label: '$200k+' },
]

export const REMOTE_OPTIONS = {
  ON_SITE: 'on-site',
  HYBRID: 'hybrid',
  REMOTE: 'remote',
}

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Media',
  'Consulting',
  'Government',
  'Non-profit',
  'Energy',
  'Transportation',
  'Real Estate',
  'Hospitality',
  'Other',
]

export const SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'Go',
  'Rust',
  'SQL',
  'MongoDB',
  'PostgreSQL',
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'Kubernetes',
  'Git',
  'CI/CD',
  'Machine Learning',
  'Data Science',
  'UI/UX Design',
  'Project Management',
  'Agile',
  'Scrum',
]

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
}

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
}

export const TOAST_DURATION = 4000

export const DEBOUNCE_DELAY = 500
