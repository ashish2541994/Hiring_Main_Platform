import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { MapPin, Building2, Users, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const CompanyProfilePage = () => {
  const { id } = useParams()

  const mockCompany = {
    name: 'Tech Corp',
    industry: 'Technology',
    location: 'San Francisco, CA',
    size: '51-200',
    website: 'https://techcorp.com',
    description: 'Tech Corp is a leading technology company specializing in innovative solutions...',
    founded: '2015',
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">{mockCompany.name}</h1>
        <p className="text-xl text-muted-foreground">{mockCompany.industry}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{mockCompany.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No open positions at the moment.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{mockCompany.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{mockCompany.industry}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{mockCompany.size} employees</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href={mockCompany.website} className="text-primary hover:underline">
                  {mockCompany.website}
                </a>
              </div>
              <hr className="border-border" />
              <Button variant="outline" className="w-full">
                Follow Company
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default CompanyProfilePage
