"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      setError("")
      setIsLoading(true)

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        setError("Invalid email or password")
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[rgb(var(--amen-green-light))] via-white to-[rgb(var(--amen-blue-light))]">
      <div className="w-full max-w-md p-6">
        <div className="flex justify-center mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Image
              src="/logo_amen_bank.png"
              alt="Amen Bank"
              width={200}
              height={80}
              priority
            />
          </div>
        </div>

        <Card className="shadow-xl border-[rgb(var(--amen-green))] border-t-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-[rgb(var(--amen-green-dark))]">
              Fund Management System
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@amenbank.com.tn"
                  {...register("email")}
                  className="focus:ring-[rgb(var(--amen-green))] focus:border-[rgb(var(--amen-green))]"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="focus:ring-[rgb(var(--amen-green))] focus:border-[rgb(var(--amen-green))]"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p className="mb-2">Default credentials for testing:</p>
              <div className="space-y-1 text-xs bg-gray-50 p-3 rounded-md">
                <p><strong>Admin:</strong> admin@amenbank.com.tn / admin123</p>
                <p><strong>Agency:</strong> agency@amenbank.com.tn / password123</p>
                <p><strong>Central Cash:</strong> cash@amenbank.com.tn / password123</p>
                <p><strong>Security:</strong> security@tunisiasecurity.tn / password123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-4">
          © 2025 Amen Bank. All rights reserved.
        </p>
      </div>
    </div>
  )
}