export interface Database {
        public: {
                Tables: {
                        student_registrations: {
                                Row: {
                                        id: string
                                        created_at: string
                                        real_name: string
                                        preferred_name: string | null
                                        age: number
                                        gender: string
                                        email: string
                                        phone_number: string
                                        wechat_id: string | null
                                        school: string
                                        grade: string | null
                                        skills: string[]
                                        experience: string | null
                                        links: string | null
                                }
                                Insert: Omit<Database['public']['Tables']['student_registrations']['Row'], 'id' | 'created_at'>
                        }
                        school_registrations: {
                                Row: {
                                        id: string
                                        created_at: string
                                        school_name: string
                                        teacher_name: string
                                        contact_email: string
                                        contact_phone: string
                                        contact_wechat: string | null
                                        student_count: number
                                }
                                Insert: Omit<Database['public']['Tables']['school_registrations']['Row'], 'id' | 'created_at'>
                        }
                        school_students: {
                                Row: {
                                        id: string
                                        school_registration_id: string
                                        name: string
                                        age: number
                                        gender: string
                                        skills: string[]
                                        extra: string | null
                                        hackathon_experience: boolean
                                }
                                Insert: Omit<Database['public']['Tables']['school_students']['Row'], 'id'>
                        }
                }
        }
}

export type StudentRegistration = Database['public']['Tables']['student_registrations']['Row']
export type SchoolRegistration = Database['public']['Tables']['school_registrations']['Row']
export type SchoolStudent = Database['public']['Tables']['school_students']['Row']

export type StudentRegistrationInsert = Database['public']['Tables']['student_registrations']['Insert']
export type SchoolRegistrationInsert = Database['public']['Tables']['school_registrations']['Insert']
export type SchoolStudentInsert = Database['public']['Tables']['school_students']['Insert']
