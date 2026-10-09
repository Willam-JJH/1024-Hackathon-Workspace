import { z } from 'zod';

// Base schemas
const studentDataSchema = z.object({
        name: z.string().min(1, 'Name is required').max(255),
        age: z.number().int().min(12, 'Age must be at least 12').max(19, 'Age must be at most 18'),
        gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
        skills: z.array(z.string()).min(1, { message: 'Skills are required' }),
        extra: z.string().optional().nullable(),
        hackathonExperience: z.boolean().default(false).optional()
});

const contactSchema = z.object({
        email: z.string().email('Invalid email'),
        phone: z.string().min(1, 'Phone number is required'),
        wechat: z.string().optional()
});

// Teacher registration schema
export const registerSchema = z.object({
        schoolName: z.string().min(1, 'School name is required').max(255),
        teacherName: z.string().min(1, 'Teacher name is required').max(255),
        contact: contactSchema,
        studentCount: z.number().int().min(1, 'At least one student required').max(10, 'Maximum 10 students allowed'),
        students: z.array(studentDataSchema).min(1, 'At least one student required').max(10, 'Maximum 10 students allowed')
});

// Student self-registration schema
export const studentSchema = z.object({
        realName: z.string().min(1, 'Real name is required'),
        preferredName: z.string().optional(),
        age: z.number().int().min(12, 'Age must be at least 12').max(19, 'Age must be at most 18'),
        gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
        email: z.string().email('Invalid email').min(1, 'Email is required'),
        phoneNumber: z.string().min(1, 'Phone number is required'),
        wechatId: z.string().optional(),
        school: z.string().min(1, 'School name is required'),
        grade: z.string().optional(),
        skills: z.array(z.string()).min(1, { message: 'Skills are required' }),
        experience: z.string().optional(),
        links: z.string().optional()
});

// Teacher self-registration schema
export const teacherSchema = z.object({
        source: z.string().min(1, 'Source is required'),
        name: z.string().min(1, 'Name is required'),
        school: z.string().min(1, 'School is required'),
        birthdate: z.string().min(1, 'Birthdate is required'),
        interest: z.string().min(1, 'Interest is required')
});

// Type exports
export interface StudentData {
        name: string;
        age: number;
        gender: 'male' | 'female' | 'other';
        skills: string[];
        extra?: string;
        hackathonExperience?: boolean; // Make optional to match schema default
}

export interface RegisterFormData {
        schoolName: string;
        teacherName: string;
        contact: {
                email: string;
                phone: string;
                wechat?: string;
        };
        studentCount: number;
        students: StudentData[];
}

// Ensure type compatibility with Zod schema
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type StudentFormData = z.infer<typeof studentSchema>;
export type TeacherFormData = z.infer<typeof teacherSchema>;
