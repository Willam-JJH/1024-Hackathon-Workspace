import { z } from 'zod';

const skillsEnum = [
        'Programming',
        'UI/UX Design',
        'Presentation',
        'Prompt Engineering',
        'Product Design',
        'Business'
] as const;

const contactSchema = z.object({
        email: z.string().email('register.form.contact.email.error'),
        phone: z.string().min(1, 'register.form.contact.phone.error'),
        wechat: z.string().optional()
});

// Add type for consistent use in form
export type ContactSchema = z.infer<typeof contactSchema>;

const studentSchema = z.object({
        name: z.string().min(1, 'register.form.student.name.error'),
        age: z.number().min(12, 'register.form.student.age.error').max(19, 'register.form.student.age.error'),
        gender: z.enum(['male', 'female', 'other'], {
                errorMap: () => ({ message: 'register.form.student.gender.error' })
        }),
        skills: z.array(z.union([
                z.enum(skillsEnum),
                z.string().min(1)
        ])).min(1, 'register.form.student.skills.error'),
        extra: z.string().optional(),
        hackathonExperience: z.boolean()
});

export const registerSchema = z.object({
        schoolName: z.string().min(1, 'register.form.schoolName.error'),
        teacherName: z.string().min(1, 'register.form.teacherName.error'),
        contact: contactSchema,
        studentCount: z.number().min(1, 'register.form.studentCount.error'),
        students: z.array(studentSchema)
                .min(1, 'register.form.students.error')
                .refine((students) => students.length > 0, {
                        message: 'register.form.students.error'
                })
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type Skills = typeof skillsEnum[number];
