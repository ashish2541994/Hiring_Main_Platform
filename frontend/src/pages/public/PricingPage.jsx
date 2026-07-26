import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const PricingPage = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        'Browse all jobs',
        'Basic profile',
        'Apply to 5 jobs/month',
        'Save jobs',
      ],
    },
    {
      name: 'Pro',
      price: '$19',
      description: 'For serious job seekers',
      features: [
        'Everything in Free',
        'Unlimited applications',
        'Priority listing',
        'Profile visibility boost',
        'Application analytics',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated support',
        'Advanced analytics',
        'API access',
      ],
    },
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works best for you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={plan.popular ? 'border-primary shadow-lg' : ''}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-muted-foreground">/month</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                    {plan.popular ? 'Get Started' : 'Contact Sales'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PricingPage
