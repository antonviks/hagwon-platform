// src/types/index.ts

export interface Profile {
    id: string
    user_type: 'teacher' | 'hagwon'
    email: string
    full_name?: string
    avatar_url?: string
    created_at: string
  }
  
  export interface TeacherProfile {
    id: string
    nationality?: string
    location_preference?: string
    bio?: string
    subjects: string[]
    experience_years?: number
    salary_expectation_min?: number
    salary_expectation_max?: number
    profile_complete: boolean
  }
  
  export interface HagwonProfile {
    id: string
    school_name?: string
    location?: string
    description?: string
    website?: string
  }
  
  export interface Job {
    id: string
    hagwon_id: string
    title: string
    description?: string
    subjects: string[]
    location?: string
    salary_min?: number
    salary_max?: number
    requirements?: string
    is_active: boolean
    created_at: string
    hagwon_profiles?: HagwonProfile
  }
  
  export interface Application {
    id: string
    teacher_id: string
    job_id: string
    message: string
    status: 'sent' | 'viewed' | 'responded' | 'rejected'
    created_at: string
  }