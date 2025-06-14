// src/app/profile/setup/page.tsx

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { TeacherProfileForm } from '@/components/profile/TeacherProfileForm'
import { HagwonProfileForm } from '@/components/profile/HagwonProfileForm'

export default function ProfileSetupPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleComplete = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {profile?.user_type === 'teacher' ? (
        <TeacherProfileForm onComplete={handleComplete} />
      ) : (
        <HagwonProfileForm onComplete={handleComplete} />
      )}
    </div>
  )
}