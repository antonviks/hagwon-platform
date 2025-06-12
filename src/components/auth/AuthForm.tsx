'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface AuthFormProps {
  mode: 'login' | 'signup'
  userType?: 'teacher' | 'hagwon'
  onSuccess?: () => void
}

export function AuthForm({ mode, userType = 'teacher', onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'signup') {
        const signUpResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              user_type: userType,
              full_name: fullName
            }
          }
        })

        if (signUpResult.error) throw signUpResult.error

        if (signUpResult.data.user && !signUpResult.data.user.email_confirmed_at) {
          setMessage('Check your email for the confirmation link!')
        } else {
          setMessage('Account created successfully!')
          onSuccess?.()
        }
      } else {
        const signInResult = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (signInResult.error) throw signInResult.error

        setMessage('Logged in successfully!')
        onSuccess?.()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Welcome Back' : `Join as ${userType === 'teacher' ? 'Teacher' : 'Hagwon'}`}
          </h2>
          <p className="text-gray-600 mt-2">
            {mode === 'login' 
              ? 'Sign in to your account' 
              : `Create your ${userType} account`
            }
          </p>
        </div>

        {mode === 'signup' && (
          <Input
            label="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-green-600 text-sm">{message}</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          loading={loading}
          disabled={loading}
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </div>
  )
}