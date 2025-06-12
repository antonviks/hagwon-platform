'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/lib/auth-context'

const SUBJECTS = [
  'English Conversation',
  'Grammar',
  'TOEIC',
  'TOEFL', 
  'IELTS',
  'Business English',
  'Kids English',
  'Elementary',
  'Middle School',
  'High School',
  'SAT',
  'Math',
  'Science'
]

const LOCATIONS = [
  'Seoul - Gangnam',
  'Seoul - Gangbuk',
  'Seoul - Mapo',
  'Seoul - Songpa',
  'Incheon',
  'Busan',
  'Daegu',
  'Daejeon',
  'Gwangju',
  'Other'
]

const NATIONALITIES = [
  'American',
  'Canadian', 
  'British',
  'Australian',
  'New Zealand',
  'South African',
  'Irish',
  'Other Native English',
  'Other'
]

interface TeacherProfileFormProps {
  onComplete: () => void
}

export function TeacherProfileForm({ onComplete }: TeacherProfileFormProps) {
  const { user, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    nationality: '',
    location_preference: '',
    bio: '',
    subjects: [] as string[],
    experience_years: '',
    salary_expectation_min: '',
    salary_expectation_max: ''
  })

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Create teacher profile
      const { error: profileError } = await supabase
        .from('teacher_profiles')
        .insert({
          id: user.id,
          nationality: formData.nationality,
          location_preference: formData.location_preference,
          bio: formData.bio,
          subjects: formData.subjects,
          experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
          salary_expectation_min: formData.salary_expectation_min ? parseInt(formData.salary_expectation_min) : null,
          salary_expectation_max: formData.salary_expectation_max ? parseInt(formData.salary_expectation_max) : null,
          profile_complete: true
        })

      if (profileError) throw profileError

      // Update main profile with full name if not set
      await supabase
        .from('profiles')
        .update({ 
          full_name: user.user_metadata?.full_name || 'Teacher'
        })
        .eq('id', user.id)

      await refreshProfile()
      onComplete()

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Complete Your Teacher Profile</h1>
        <p className="text-gray-600 mt-2">Help hagwons find the perfect match for their needs</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nationality</label>
              <select 
                value={formData.nationality}
                onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select nationality</option>
                {NATIONALITIES.map(nat => (
                  <option key={nat} value={nat}>{nat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preferred Location</label>
              <select 
                value={formData.location_preference}
                onChange={(e) => setFormData(prev => ({ ...prev, location_preference: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select location</option>
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Input
              label="Years of Teaching Experience"
              type="number"
              value={formData.experience_years}
              onChange={(e) => setFormData(prev => ({ ...prev, experience_years: e.target.value }))}
              min="0"
              max="50"
            />
          </div>
        </div>

        {/* Subjects */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Subjects You Can Teach</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SUBJECTS.map(subject => (
              <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.subjects.includes(subject)}
                  onChange={() => handleSubjectToggle(subject)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{subject}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary Expectations */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">Salary Expectations (KRW per month)</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Minimum Expected Salary"
              type="number"
              value={formData.salary_expectation_min}
              onChange={(e) => setFormData(prev => ({ ...prev, salary_expectation_min: e.target.value }))}
              placeholder="2500000"
            />
            <Input
              label="Maximum Expected Salary"
              type="number"
              value={formData.salary_expectation_max}
              onChange={(e) => setFormData(prev => ({ ...prev, salary_expectation_max: e.target.value }))}
              placeholder="3500000"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">About You</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell hagwons about your teaching philosophy, experience, and what makes you unique..."
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <Button 
          type="submit" 
          size="lg" 
          className="w-full"
          loading={loading}
          disabled={loading || formData.subjects.length === 0}
        >
          Complete Profile
        </Button>
      </form>
    </div>
  )
}