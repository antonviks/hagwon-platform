// src/types/database.ts

export interface Database {
    public: {
      Tables: {
        profiles: {
          Row: {
            id: string
            user_type: 'teacher' | 'hagwon'
            email: string
            full_name: string | null
            avatar_url: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id: string
            user_type: 'teacher' | 'hagwon'
            email: string
            full_name?: string | null
            avatar_url?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_type?: 'teacher' | 'hagwon'
            email?: string
            full_name?: string | null
            avatar_url?: string | null
            created_at?: string
            updated_at?: string
          }
        }
        teacher_profiles: {
          Row: {
            id: string
            nationality: string | null
            location_preference: string | null
            bio: string | null
            subjects: string[]
            experience_years: number | null
            salary_expectation_min: number | null
            salary_expectation_max: number | null
            profile_complete: boolean
            created_at: string
            updated_at: string
          }
          Insert: {
            id: string
            nationality?: string | null
            location_preference?: string | null
            bio?: string | null
            subjects?: string[]
            experience_years?: number | null
            salary_expectation_min?: number | null
            salary_expectation_max?: number | null
            profile_complete?: boolean
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            nationality?: string | null
            location_preference?: string | null
            bio?: string | null
            subjects?: string[]
            experience_years?: number | null
            salary_expectation_min?: number | null
            salary_expectation_max?: number | null
            profile_complete?: boolean
            created_at?: string
            updated_at?: string
          }
        }
        jobs: {
          Row: {
            id: string
            hagwon_id: string
            title: string
            description: string | null
            subjects: string[]
            location: string | null
            salary_min: number | null
            salary_max: number | null
            requirements: string | null
            is_active: boolean
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            hagwon_id: string
            title: string
            description?: string | null
            subjects?: string[]
            location?: string | null
            salary_min?: number | null
            salary_max?: number | null
            requirements?: string | null
            is_active?: boolean
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            hagwon_id?: string
            title?: string
            description?: string | null
            subjects?: string[]
            location?: string | null
            salary_min?: number | null
            salary_max?: number | null
            requirements?: string | null
            is_active?: boolean
            created_at?: string
            updated_at?: string
          }
        }
        applications: {
          Row: {
            id: string
            teacher_id: string
            job_id: string
            message: string
            status: 'sent' | 'viewed' | 'responded' | 'rejected'
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            teacher_id: string
            job_id: string
            message: string
            status?: 'sent' | 'viewed' | 'responded' | 'rejected'
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            teacher_id?: string
            job_id?: string
            message?: string
            status?: 'sent' | 'viewed' | 'responded' | 'rejected'
            created_at?: string
            updated_at?: string
          }
        }
      }
      Functions: {
        get_job_recommendations: {
          Args: {
            teacher_uuid: string
            limit_count?: number
          }
          Returns: {
            id: string
            title: string
            description: string | null
            subjects: string[]
            location: string | null
            salary_min: number | null
            salary_max: number | null
            school_name: string | null
            hagwon_location: string | null
            created_at: string
          }[]
        }
        get_daily_application_count: {
          Args: {
            teacher_uuid: string
          }
          Returns: number
        }
        increment_daily_applications: {
          Args: {
            teacher_uuid: string
          }
          Returns: number
        }
      }
    }
  }