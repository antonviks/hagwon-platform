// src/app/(auth)/signup/page.tsx

'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AuthForm } from '@/components/auth/AuthForm'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function SignupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [userType, setUserType] = useState<'teacher' | 'hagwon'>(
    (searchParams.get('type') as 'teacher' | 'hagwon') || 'teacher'
  )

  const handleSuccess = () => {
    router.push('/profile/setup')
  }

  return (
    <div>
      {/* User Type Selection */}
      <div className="mb-6">
        <p className="text-center text-sm text-gray-600 mb-3">I am a:</p>
        <div className="flex space-x-2">
          <Button 
            variant={userType === 'teacher' ? 'primary' : 'outline'}
            onClick={() => setUserType('teacher')}
            className="flex-1"
          >
            Teacher
          </Button>
          <Button 
            variant={userType === 'hagwon' ? 'primary' : 'outline'}
            onClick={() => setUserType('hagwon')}
            className="flex-1"
          >
            Hagwon
          </Button>
        </div>
      </div>

      <AuthForm mode="signup" userType={userType} onSuccess={handleSuccess} />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}