import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
// Redirect will go to landing page after registration

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    passwordConfirmation: z.string(),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Passwords do not match",
  });

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "candidate",
      passwordConfirmation: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Always register as candidate — backend forces role to "candidate"
      const { role: _unused, ...cleanData } = data;
      const result = await registerUser(cleanData);
      toast.success("Account created successfully");
      navigate("/", {
        replace: true,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Join Wind Hire and start your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                error={errors.passwordConfirmation?.message}
                {...register("passwordConfirmation")}
              />

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  {...register("termsAccepted")}
                  className="mt-1"
                />

                <label htmlFor="termsAccepted" className="text-sm">
                  I agree to the Terms & Conditions
                </label>
              </div>

              {errors.termsAccepted && (
                <p className="text-sm text-red-500">
                  {errors.termsAccepted.message}
                </p>
              )}
              <Button type="submit" className="w-full" loading={loading}>
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
