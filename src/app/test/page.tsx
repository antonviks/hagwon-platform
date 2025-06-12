// src/app/test/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...')
  const [tables, setTables] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Test 1: Basic connection
      const { data, error } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true })

      if (error) {
        setError(`Connection failed: ${error.message}`)
        setConnectionStatus('❌ Failed')
        return
      }

      setConnectionStatus('✅ Connected')

      // Test 2: List all tables we can access
      const tableTests = [
        'profiles',
        'teacher_profiles', 
        'hagwon_profiles',
        'jobs',
        'applications',
        'daily_applications',
        'messages'
      ]

      const accessibleTables = []
      for (const table of tableTests) {
        try {
          await supabase.from(table).select('count', { count: 'exact', head: true })
          accessibleTables.push(`✅ ${table}`)
        } catch (err) {
          accessibleTables.push(`❌ ${table}`)
        }
      }
      
      setTables(accessibleTables)

    } catch (err) {
      setError(`Unexpected error: ${err}`)
      setConnectionStatus('❌ Failed')
    }
  }

  const testAuth = async () => {
    try {
      // Test auth signup (won't actually create user, just test the endpoint)
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123'
      })
      
      if (error && error.message.includes('already registered')) {
        alert('✅ Auth is working (user already exists)')
      } else if (error) {
        alert(`❌ Auth error: ${error.message}`)
      } else {
        alert('✅ Auth signup worked')
      }
    } catch (err) {
      alert(`❌ Auth failed: ${err}`)
    }
  }

  const testFunction = async () => {
    try {
      // Test our custom function (will fail with no user, but should reach the function)
      const { data, error } = await supabase.rpc('get_daily_application_count', {
        teacher_uuid: '00000000-0000-0000-0000-000000000000'
      })
      
      if (error) {
        alert(`Function test: ${error.message.includes('function') ? '❌ Function not found' : '✅ Function exists but needs auth'}`)
      } else {
        alert('✅ Function working')
      }
    } catch (err) {
      alert(`❌ Function test failed: ${err}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Backend Test Page</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
          <p className="text-lg">Status: {connectionStatus}</p>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Table Access</h2>
          <ul className="space-y-2">
            {tables.map((table, index) => (
              <li key={index} className="font-mono">{table}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Manual Tests</h2>
          <div className="space-x-4">
            <button 
              onClick={testAuth}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Auth
            </button>
            <button 
              onClick={testFunction}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Functions
            </button>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <ul className="space-y-2">
            <li>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
            <li>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}