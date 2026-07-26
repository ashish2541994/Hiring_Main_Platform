import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Job from './models/Job.js'
import Company from './models/Company.js'
import Application from './models/Application.js'
import Notification from './models/Notification.js'
import Message from './models/Message.js'
import dotenv from 'dotenv'

dotenv.config()

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wind-hire'

// Indian IT job titles
const jobTitles = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'React Developer',
  'Node Developer',
  'Java Developer',
  'Python Developer',
  'DevOps Engineer',
  'Cloud Engineer',
  'ML Engineer',
  'AI Engineer',
  'Data Analyst',
  'QA Engineer',
  'Cyber Security Engineer',
  'Android Developer',
  'Flutter Developer',
  '.NET Developer',
  'UI UX Designer',
  'Full Stack Developer',
  'Database Administrator',
]

// Indian cities
const indianCities = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Noida', 'Gurgaon', 'Coimbatore', 'Kochi'
]

// Indian company names
const companyNames = [
  'Tata Consultancy Services',
  'Infosys',
  'Wipro',
  'HCL Technologies',
  'Tech Mahindra',
  'Larsen & Toubro Infotech',
  'Mindtree',
  'Mphasis',
  'Hexaware',
  'Zensar Technologies',
  'Cyient',
  'L&T Technology Services',
  'Oracle Financial Services',
  'NIIT Technologies',
  'KPIT Technologies',
  'Birlasoft',
  'Subex Limited',
  'Rolta India',
  '3i Infotech',
  'Polaris Consulting',
]

// Industries (must match Company model enum)
const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
  'Retail', 'Media', 'Consulting', 'Government', 'Non-profit',
  'Energy', 'Transportation', 'Real Estate', 'Hospitality', 'Other'
]

// Skills arrays
const skillSets = [
  ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
  ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Docker'],
  ['Python', 'Django', 'Flask', 'PostgreSQL', 'Redis'],
  ['React', 'Redux', 'TypeScript', 'Next.js', 'Tailwind CSS'],
  ['Android', 'Kotlin', 'Java', 'Firebase', 'REST APIs'],
  ['Flutter', 'Dart', 'Firebase', 'State Management', 'API Integration'],
  ['.NET', 'C#', 'Azure', 'SQL Server', 'Entity Framework'],
  ['DevOps', 'Docker', 'Kubernetes', 'Jenkins', 'AWS'],
  ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
  ['Cyber Security', 'Penetration Testing', 'Network Security', 'CISSP', 'Ethical Hacking'],
]

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear ONLY specified collections (keep users, otps, sessions, refreshtokens, auditlogs)
    console.log('Clearing dummy data...')
    await Company.deleteMany({})
    await Job.deleteMany({})
    await Application.deleteMany({})
    await Notification.deleteMany({})
    await Message.deleteMany({})
    console.log('Dummy data cleared')

    // Get existing users for relations
    const existingUsers = await User.find({ role: { $in: ['recruiter', 'candidate'] } })
    const recruiters = existingUsers.filter(u => u.role === 'recruiter')
    const candidates = existingUsers.filter(u => u.role === 'candidate')

    console.log(`Found ${recruiters.length} recruiters and ${candidates.length} candidates`)

    // Create 20 companies
    console.log('Creating 20 companies...')
    const companies = []
    for (let i = 0; i < 20; i++) {
      const companyName = companyNames[i % companyNames.length]
      const company = await Company.create({
        name: companyName,
        slug: companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: `${companyName} is a leading technology company providing innovative solutions for enterprises worldwide. We specialize in software development, cloud services, and digital transformation.`,
        email: `contact@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        logo: '',
        website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        industry: industries[i % industries.length],
        size: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'][i % 6],
        founded: 1990 + Math.floor(Math.random() * 30),
        location: {
          country: 'India',
          city: indianCities[i % indianCities.length],
          state: ['Karnataka', 'Maharashtra', 'Delhi', 'Telangana', 'Tamil Nadu'][i % 5],
          address: `Tech Park, Sector ${Math.floor(Math.random() * 100)}`,
        },
        linkedin: `https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '')}`,
        verified: i < 15,
        isActive: true,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      })
      companies.push(company)
    }
    console.log(`Created ${companies.length} companies`)

    // Create 50 jobs
    console.log('Creating 50 jobs...')
    const jobs = []
    for (let i = 0; i < 50; i++) {
      const jobTitle = jobTitles[i % jobTitles.length]
      const company = companies[i % companies.length]
      const recruiter = recruiters[i % recruiters.length] || recruiters[0]
      const skills = skillSets[i % skillSets.length]
      
      const job = await Job.create({
        title: jobTitle,
        slug: jobTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: `We are looking for a talented ${jobTitle} to join our team. The ideal candidate will have strong technical skills and a passion for building innovative solutions.`,
        requirements: `${skills.slice(0, 3).join(', ')}. 3+ years of experience in relevant technologies. Strong problem-solving skills.`,
        responsibilities: `Develop and maintain software solutions, collaborate with cross-functional teams, participate in code reviews, ensure code quality.`,
        benefits: 'Health insurance, PF, ESOP, Flexible hours, Remote work options',
        skills: skills,
        salary: { 
          min: 500000 + Math.floor(Math.random() * 500000), 
          max: 1000000 + Math.floor(Math.random() * 1000000), 
          currency: 'INR',
          period: 'yearly'
        },
        experienceLevel: ['entry', 'mid', 'senior'][i % 3],
        type: ['full-time', 'part-time', 'contract', 'internship'][i % 4],
        location: {
          type: ['on-site', 'remote', 'hybrid'][i % 3],
          country: 'India',
          city: indianCities[i % indianCities.length],
        },
        category: ['Engineering', 'Design', 'Product', 'Data', 'DevOps'][i % 5],
        applicationCount: Math.floor(Math.random() * 50),
        viewCount: Math.floor(Math.random() * 500),
        company: company._id,
        postedBy: recruiter._id,
        status: 'active',
        expiresAt: new Date(Date.now() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000),
      })
      jobs.push(job)
    }
    console.log(`Created ${jobs.length} jobs`)

    // Create 100 applications
    console.log('Creating 100 applications...')
    const applications = []
    const statuses = ['pending', 'reviewed', 'shortlisted', 'interviewing', 'rejected', 'hired']
    for (let i = 0; i < 100; i++) {
      const job = jobs[i % jobs.length]
      const candidate = candidates[i % candidates.length] || candidates[0]
      const jobCompany = companies.find(c => c._id.equals(job.company))
      
      const application = await Application.create({
        job: job._id,
        candidate: candidate._id,
        company: jobCompany._id,
        recruiter: job.postedBy,
        status: statuses[i % statuses.length],
        coverLetter: `I am excited to apply for the ${job.title} position at ${jobCompany?.name || 'your company'}. With my experience and skills, I believe I would be a great fit for this role.`,
        resume: `resumes/candidate_${candidate._id}_resume.pdf`,
      })
      applications.push(application)
    }
    console.log(`Created ${applications.length} applications`)

    // Create 40 notifications
    console.log('Creating 40 notifications...')
    const notifications = []
    const notificationTypes = ['application', 'message', 'job', 'system', 'profile']
    const notificationMessages = [
      'Your application has been shortlisted.',
      'Interview scheduled for next week.',
      'Your profile was viewed by a recruiter.',
      'New job matching your profile is available.',
      'Application status updated to Reviewed.',
      'Congratulations! You have been selected for the position.',
      'Your application is under review.',
      'A recruiter sent you a message.',
    ]
    for (let i = 0; i < 40; i++) {
      const recipient = candidates[i % candidates.length] || candidates[0]
      
      const notification = await Notification.create({
        recipient: recipient._id,
        type: notificationTypes[i % notificationTypes.length],
        title: notificationMessages[i % notificationMessages.length].split('.')[0],
        message: notificationMessages[i % notificationMessages.length],
        link: `/candidate/applications`,
        read: Math.random() > 0.5,
        readAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        data: { jobId: jobs[i % jobs.length]._id },
      })
      notifications.push(notification)
    }
    console.log(`Created ${notifications.length} notifications`)

    // Create 30 messages
    console.log('Creating 30 messages...')
    const messages = []
    const messageContents = [
      'Hi, I saw your application and would like to schedule an interview.',
      'Thank you for considering my application. I am available for an interview.',
      'Could you please share more details about the role?',
      'The position requires 3+ years of experience. Is that correct?',
      'I have attached my resume for your review.',
      'When can we schedule a technical round?',
      'The team is impressed with your profile.',
      'Looking forward to hearing from you.',
    ]
    for (let i = 0; i < 30; i++) {
      const sender = i % 2 === 0 ? recruiters[i % recruiters.length] : candidates[i % candidates.length]
      const receiver = i % 2 === 0 ? candidates[i % candidates.length] : recruiters[i % recruiters.length]
      const job = jobs[i % jobs.length]
      
      const message = await Message.create({
        sender: sender._id,
        receiver: receiver._id,
        jobId: job._id,
        content: messageContents[i % messageContents.length],
        read: Math.random() > 0.5,
        readAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
      })
      messages.push(message)
    }
    console.log(`Created ${messages.length} messages`)

    console.log('\n=== Seed Data Summary ===')
    console.log(`Companies: ${companies.length}`)
    console.log(`Jobs: ${jobs.length}`)
    console.log(`Applications: ${applications.length}`)
    console.log(`Notifications: ${notifications.length}`)
    console.log(`Messages: ${messages.length}`)
    console.log('\nSeed completed successfully!')

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seedData()
