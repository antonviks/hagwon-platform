'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/lib/auth-context'

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

interface HagwonProfileFormProps {
  onComplete: () => void
}

export function HagwonProfileForm({ onComplete }: HagwonProfileFormProps) {
  const { user, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    school_name: '',
    location: '',
    description: '',
    website: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Create hagwon profile
      const { error: profileError } = await supabase
        .from('hagwon_profiles')
        .insert({
          id: user.id,
          school_name: formData.school_name,
          location: formData.location,
          description: formData.description,
          website: formData.website || null
        })

      if (profileError) throw profileError

      // Update main profile with school name
      await supabase
        .from('profiles')
        .update({ 
          full_name: formData.school_name
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
        <h1 className="text-3xl font-bold">Complete Your Hagwon Profile</h1>
        <p className="text-gray-600 mt-2">Help teachers learn about your school and opportunities</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">School Information</h2>
          
          <Input
            label="School Name"
            type="text"
            value={formData.school_name}
            onChange={(e) => setFormData(prev => ({ ...prev, school_name: e.target.value }))}
            required
            placeholder="ABC English Academy"
          />

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <select 
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select location</option>
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <Input
            label="Website (Optional)"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            placeholder="https://www.yourschool.com"
          />

          <div>
            <label className="block text-sm font-medium mb-2">School Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={6}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell teachers about your school's mission, teaching philosophy, student demographics, facilities, and what makes your hagwon a great place to work..."
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
          disabled={loading}
        >
          Complete Profile
        </Button>
      </form>
    </div>
  )
}