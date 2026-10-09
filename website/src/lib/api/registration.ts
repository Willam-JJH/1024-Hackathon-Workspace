import { supabase } from '../supabase'
import type { TeacherFormData, StudentFormData, RegisterFormData } from '../schemas/register'
import type {
        StudentRegistrationInsert,
        SchoolRegistrationInsert,
        SchoolStudentInsert
} from '../types/database'

export async function submitStudentRegistration(data: StudentFormData) {
        if (data.skills.length === 0) {
                throw new Error('At least one skill is required');
        }

        const studentData: StudentRegistrationInsert = {
                real_name: data.realName.trim(),
                preferred_name: data.preferredName?.trim() || null,
                age: Math.min(Math.max(data.age, 12), 19), // Ensure age is within bounds
                gender: data.gender,
                email: data.email.trim(),
                phone_number: data.phoneNumber.trim(),
                wechat_id: data.wechatId?.trim() || null,
                school: data.school.trim(),
                grade: data.grade?.trim() || null,
                skills: data.skills.filter(Boolean), // Remove any empty strings
                experience: data.experience?.trim() || null,
                links: data.links?.trim() || null
        }

        const { error } = await supabase
                .from('student_registrations')
                .insert(studentData)

        if (error) {
                throw error
        }
}

export async function submitSchoolRegistration(data: RegisterFormData) {
        try {
                // Validate data before inserting
                if (!data.students || data.students.length === 0) {
                        throw new Error('No students provided');
                }

                // Validate RLS policy conditions first
                const schoolName = data.schoolName.trim();
                const teacherName = data.teacherName.trim();
                const studentCount = Math.min(Math.max(1, data.students.length), 10);

                if (schoolName.length === 0) {
                        throw new Error('School name cannot be empty');
                }

                if (teacherName.length === 0) {
                        throw new Error('Teacher name cannot be empty');
                }

                if (studentCount <= 0 || studentCount > 10) {
                        throw new Error('Student count must be between 1 and 10');
                }

                // First insert the school registration and get its ID
                const { data: reg, error: schoolError } = await supabase
                        .from('school_registrations')
                        .insert({
                                school_name: schoolName,
                                teacher_name: teacherName,
                                contact_email: data.contact.email.trim(),
                                contact_phone: data.contact.phone.trim(),
                                contact_wechat: data.contact.wechat?.trim() || null,
                                student_count: studentCount
                        })
                        .select('id')
                        .single();

                if (schoolError) {
                        console.error('School registration error:', schoolError);
                        throw new Error(
                                schoolError.message === 'JWT expired'
                                        ? 'Session expired. Please refresh the page and try again.'
                                        : schoolError.message || 'Failed to create school registration'
                        );
                }

                if (!reg?.id) {
                        throw new Error('Failed to get school registration ID');
                }

                // Map and validate students data
                const studentsData = data.students.slice(0, studentCount).map(student => {
                        if (!student.skills || student.skills.length === 0) {
                                throw new Error('At least one skill is required for each student');
                        }

                        return {
                                school_registration_id: reg.id,
                                name: student.name.trim(),
                                age: Math.min(Math.max(student.age, 12), 19),
                                gender: student.gender,
                                skills: student.skills.filter(Boolean),
                                extra: student.extra?.trim() || null,
                                hackathon_experience: student.hackathonExperience ?? false
                        };
                });

                if (!studentsData.every(s => s.skills.length > 0)) {
                        throw new Error('Each student must have at least one skill');
                }

                // Insert all students
                const { error: studentsError } = await supabase
                        .from('school_students')
                        .insert(studentsData);

                if (studentsError) {
                        // If students insert fails, clean up the school registration
                        await supabase
                                .from('school_registrations')
                                .delete()
                                .eq('id', reg.id);

                        console.error('Students registration error:', studentsError);
                        throw new Error(
                                studentsError.message === 'JWT expired'
                                        ? 'Session expired. Please refresh the page and try again.'
                                        : studentsError.message || 'Failed to register students'
                        );
                }
        } catch (error) {
                console.error('Registration error:', error);
                throw error;
        }
}
