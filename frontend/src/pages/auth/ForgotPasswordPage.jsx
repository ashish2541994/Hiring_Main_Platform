import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      // TODO: Implement forgot password API call
      toast.success('Password reset email sent')
      setSent(true)
    } catch (error) {
      toast.error('Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              {sent
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive reset instructions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Button type="submit" className="w-full" loading={loading}>
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to your email. Please check your inbox.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSent(false)}
                >
                  Send Again
                </Button>
              </div>
            )}

            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="text-primary hover:underline font-medium">
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default ForgotPasswordPage
