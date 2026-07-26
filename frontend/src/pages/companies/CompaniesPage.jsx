import { motion } from 'framer-motion'
import { Building2, MapPin, Users, Briefcase } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

const CompaniesPage = () => {
  const companies = [
    {
      id: 1,
      name: 'TechCorp',
      industry: 'Technology',
      location: 'San Francisco, CA',
      employees: '1000+',
      openJobs: 15,
      logo: '',
      description: 'Leading technology company specializing in software development and cloud solutions.'
    },
    {
      id: 2,
      name: 'InnovateLabs',
      industry: 'Technology',
      location: 'Austin, TX',
      employees: '500-1000',
      openJobs: 8,
      logo: '',
      description: 'Innovative startup focused on AI and machine learning solutions.'
    },
    {
      id: 3,
      name: 'DataDriven Inc',
      industry: 'Technology',
      location: 'New York, NY',
      employees: '501-1000',
      openJobs: 12,
      logo: '',
      description: 'Data analytics and business intelligence solutions for enterprises.'
    },
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Companies</h1>
        <p className="text-muted-foreground">
          Discover top companies hiring now
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/companies/${company.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{company.name[0]}</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {company.industry}
                    </span>
                  </div>
                  <CardTitle className="mt-4">{company.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {company.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{company.employees} employees</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{company.openJobs} open positions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default CompaniesPage
