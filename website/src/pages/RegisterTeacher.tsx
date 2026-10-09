import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../lib/schemas/register';
import { submitSchoolRegistration } from '../lib/api/registration';

interface RegisterTeacherProps {
        onSuccess: () => void;
}

const RegisterTeacher = ({ onSuccess }: RegisterTeacherProps) => {
        const { t } = useTranslation();
        const [submitting, setSubmitting] = useState(false);
        const [submitError, setSubmitError] = useState<string | null>(null);
        const [deletedStudents, setDeletedStudents] = useState<Array<{
                index: number;
                data: RegisterFormData['students'][0];
        }>>([]);

        const handleStudentCount = (action: 'increase' | 'decrease') => {
                const currentStudents = getValues('students');
                if (action === 'decrease' && currentStudents.length > 1) {
                        // Store the student being removed
                        setDeletedStudents(prev => [...prev, {
                                index: currentStudents.length - 1,
                                data: currentStudents[currentStudents.length - 1]
                        }]);
                        setValue('students', currentStudents.slice(0, -1));
                        setValue('studentCount', currentStudents.length - 1);
                } else if (action === 'increase') {
                        // Check if we have previously deleted student data for this index
                        const deletedStudent = deletedStudents.find(s => s.index === currentStudents.length);
                        const newStudent = deletedStudent?.data || {
                                name: '',
                                age: 12,
                                gender: 'other',
                                skills: [''],
                                extra: '',
                                hackathonExperience: false
                        };

                        // Add the student and update count
                        setValue('students', [...currentStudents, newStudent]);
                        setValue('studentCount', currentStudents.length + 1);

                        // Remove the restored student from deletedStudents if it existed
                        if (deletedStudent) {
                                setDeletedStudents(prev => prev.filter(s => s.index !== deletedStudent.index));
                        }
                }
        };

        const {
                register,
                handleSubmit,
                watch,
                setValue,
                getValues,
                formState: { errors }
        } = useForm<RegisterFormData>({
                resolver: zodResolver(registerSchema) as unknown as Resolver<RegisterFormData>,
                defaultValues: {
                        schoolName: '',
                        teacherName: '',
                        contact: {
                                email: '',
                                phone: '',
                                wechat: ''
                        },
                        studentCount: 1,
                        students: [{
                                name: '',
                                age: 12,
                                gender: 'other',
                                skills: [''],
                                extra: '',
                                hackathonExperience: false
                        }]
                }
        });

        const studentCount = Number(watch('studentCount'));

        // Update students array when studentCount changes
        useEffect(() => {
                const currentCount = Number(studentCount);
                const currentStudents = getValues('students') || [];

                if (currentCount > currentStudents.length) {
                        // Add new students
                        for (let i = currentStudents.length; i < currentCount; i++) {
                                currentStudents.push({
                                        name: '',
                                        age: 12,
                                        gender: 'other',
                                        skills: [''],
                                        extra: '',
                                        hackathonExperience: false
                                });
                        }
                } else if (currentCount < currentStudents.length) {
                        // Remove extra students
                        currentStudents.splice(currentCount);
                }

                setValue('students', currentStudents);
        }, [studentCount, setValue, getValues]);

        const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
                if (submitting || submitError) return false; // Prevent submission if there's an error


                if (!data.schoolName?.trim()) {
                        setSubmitError('School name is required');
                        return false;
                }

                if (!data.teacherName?.trim()) {
                        setSubmitError('Teacher name is required');
                        return false;
                }

                if (!data.students?.length || data.students.length > 10) {
                        setSubmitError('Number of students must be between 1 and 10');
                        return false;
                }

                try {
                        setSubmitting(true);
                        setSubmitError(null);

                        await submitSchoolRegistration(data);
                        console.log('School registration successful');
                        setSubmitting(false); // Reset submitting state on success
                        onSuccess();
                } catch (error) {
                        console.error('Teacher registration error:', error);
                        let errorMessage = 'An error occurred during registration. Please try again.';

                        if (error instanceof Error) {
                                if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
                                        // Extract minutes from error message
                                        const match = error.message.match(/(\d+) minutes/);
                                        const minutes = match ? match[1] : '60';
                                        errorMessage = t('register.submit.error.rateLimit', { minutes });
                                } else {
                                        errorMessage = error.message;
                                }
                        }

                        setSubmitError(errorMessage);
                        setSubmitting(false); // Reset submitting state on error
                        return false; // Prevent form from submitting again fix
                }
        };

        return (
                <div className="min-h-screen">
                        <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                        >
                                <motion.form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="mx-auto w-full max-w-3xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                >
                                        {/* Error Modal */}
                                        <AnimatePresence>
                                                {submitError && (
                                                        <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                                                                onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setSubmitError(null);
                                                                        setSubmitting(false);
                                                                }}
                                                        >
                                                                <motion.div
                                                                        initial={{ scale: 0.9, opacity: 0 }}
                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                        exit={{ scale: 0.9, opacity: 0 }}
                                                                        className="relative w-full max-w-md rounded bg-hackathon-gray p-6 text-center"
                                                                        onClick={e => e.stopPropagation()}
                                                                >
                                                                        <button
                                                                                className="absolute right-4 top-4 text-gray-400 hover:text-white"
                                                                                onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        setSubmitError(null);
                                                                                        setSubmitting(false);
                                                                                }}
                                                                        >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                                </svg>
                                                                        </button>

                                                                        <div className="mb-4 flex items-center justify-center">
                                                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                                        </svg>
                                                                                </div>
                                                                        </div>

                                                                        <h3 className="mb-2 text-xl font-light">{t('register.submit.error.title')}</h3>
                                                                        <p className="mb-6 text-gray-300">
                                                                                {submitError}
                                                                        </p>

                                                                        <button
                                                                                className="w-full bg-hackathon-black p-3 text-center font-light transition hover:bg-opacity-80"
                                                                                onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        setSubmitError(null);
                                                                                        setSubmitting(false);
                                                                                }}
                                                                        >
                                                                                {t('register.submit.error.close')}
                                                                        </button>
                                                                </motion.div>
                                                        </motion.div>
                                                )}
                                        </AnimatePresence>

                                        {/* School and Teacher Information */}
                                        <div className="mb-8 rounded-lg border border-hackathon-lightgray p-6">
                                                <h3 className="mb-6 text-xl font-light">{t('register.form.schoolinfo')}</h3>
                                                <div className="space-y-6">
                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">{t('register.form.schoolName.label')}</label>
                                                                <input
                                                                        type="text"
                                                                        {...register('schoolName')}
                                                                        placeholder={t('register.form.schoolName.placeholder')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.schoolName ? 'border-red-500' : ''}`}
                                                                />
                                                                {errors.schoolName?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.schoolName.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>

                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">{t('register.form.teacherName.label')}</label>
                                                                <input
                                                                        type="text"
                                                                        {...register('teacherName')}
                                                                        placeholder={t('register.form.teacherName.placeholder')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.teacherName ? 'border-red-500' : ''}`}
                                                                />
                                                                {errors.teacherName?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.teacherName.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>

                                                        {/* Contact Information */}
                                                        <div className="space-y-4">
                                                                <div>
                                                                        <label className="mb-2 block text-sm font-light">{t('register.form.contact.email.label')}</label>
                                                                        <input
                                                                                type="email"
                                                                                {...register('contact.email')}
                                                                                placeholder={t('register.form.contact.email.placeholder')}
                                                                                className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.contact?.email ? 'border-red-500' : ''}`}
                                                                        />
                                                                        {errors.contact?.email?.message && (
                                                                                <motion.p
                                                                                        initial={{ opacity: 0, height: 0 }}
                                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                                        className="mt-1 text-sm text-red-500"
                                                                                >
                                                                                        {t(errors.contact.email.message)}
                                                                                </motion.p>
                                                                        )}
                                                                </div>

                                                                <div>
                                                                        <label className="mb-2 block text-sm font-light">{t('register.form.contact.phone.label')}</label>
                                                                        <input
                                                                                type="tel"
                                                                                {...register('contact.phone')}
                                                                                placeholder={t('register.form.contact.phone.placeholder')}
                                                                                className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.contact?.phone ? 'border-red-500' : ''}`}
                                                                        />
                                                                        {errors.contact?.phone?.message && (
                                                                                <motion.p
                                                                                        initial={{ opacity: 0, height: 0 }}
                                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                                        className="mt-1 text-sm text-red-500"
                                                                                >
                                                                                        {t(errors.contact.phone.message)}
                                                                                </motion.p>
                                                                        )}
                                                                </div>

                                                                <div>
                                                                        <label className="mb-2 block text-sm font-light">{t('register.form.contact.wechat.label')}</label>
                                                                        <input
                                                                                type="text"
                                                                                {...register('contact.wechat')}
                                                                                placeholder={t('register.form.contact.wechat.placeholder')}
                                                                                className="w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white"
                                                                        />
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">{t('register.form.studentCount.label')}</label>
                                                                <div className="flex items-center space-x-4">
                                                                        <button
                                                                                type="button"
                                                                                onClick={() => handleStudentCount('decrease')}
                                                                                disabled={watch('studentCount') <= 1}
                                                                                className="h-10 w-10 rounded border border-hackathon-lightgray bg-transparent text-xl font-light text-white hover:bg-hackathon-gray disabled:opacity-50"
                                                                        >
                                                                                -
                                                                        </button>
                                                                        <span className="min-w-[4rem] text-center font-light">
                                                                                {watch('studentCount')} {t('register.form.student.count', { defaultValue: 'Students' })}
                                                                        </span>
                                                                        <button
                                                                                type="button"
                                                                                onClick={() => handleStudentCount('increase')}
                                                                                className="h-10 w-10 rounded border border-hackathon-lightgray bg-transparent text-xl font-light text-white hover:bg-hackathon-gray"
                                                                        >
                                                                                +
                                                                        </button>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Students */}
                                        {[...Array(Number(studentCount))].map((_, index) => (
                                                <div key={index} className="mb-8 rounded-lg border border-hackathon-lightgray p-6">
                                                        <h3 className="mb-6 text-xl font-light">
                                                                {`${t('register.form.student.stu')} ${index + 1}`}
                                                        </h3>
                                                        <div className="space-y-6">
                                                                <div>
                                                                        <label className="mb-2 block text-sm font-light">{t('register.form.student.name.label')}</label>
                                                                        <input
                                                                                type="text"
                                                                                {...register(`students.${index}.name`)}
                                                                                placeholder={t('register.form.student.name.placeholder')}
                                                                                className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.students?.[index]?.name ? 'border-red-500' : ''}`}
                                                                        />
                                                                        {errors.students?.[index]?.name?.message && (
                                                                                <motion.p
                                                                                        initial={{ opacity: 0, height: 0 }}
                                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                                        className="mt-1 text-sm text-red-500"
                                                                                >
                                                                                        {t(errors.students[index].name.message)}
                                                                                </motion.p>
                                                                        )}
                                                                </div>

                                                                <div>
                                                                        <label className="mb-2 block text-sm font-light">{t('register.form.student.age.label')}</label>
                                                                        <input
                                                                                type="number"
                                                                                {...register(`students.${index}.age`, { valueAsNumber: true })}
                                                                                placeholder={t('register.form.student.age.placeholder')}
                                                                                className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.students?.[index]?.age ? 'border-red-500' : ''}`}
                                                                        />
                                                                        {errors.students?.[index]?.age?.message && (
                                                                                <motion.p
                                                                                        initial={{ opacity: 0, height: 0 }}
                                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                                        className="mt-1 text-sm text-red-500"
                                                                                >
                                                                                        {t(errors.students[index].age.message)}
                                                                                </motion.p>
                                                                        )}
                                                                </div>

                                                                <div>
                                                                        <label className="mb-2 block text-sm font-light">{t('register.form.student.gender.label')}</label>
                                                                        <select
                                                                                {...register(`students.${index}.gender`)}
                                                                                className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.students?.[index]?.gender ? 'border-red-500' : ''}`}
                                                                        >
                                                                                <option value="" className="bg-hackathon-black">{t('register.form.student.gender.placeholder')}</option>
                                                                                <option value="male" className="bg-hackathon-black">{t('register.form.student.gender.options.male')}</option>
                                                                                <option value="female" className="bg-hackathon-black">{t('register.form.student.gender.options.female')}</option>
                                                                                <option value="other" className="bg-hackathon-black">{t('register.form.student.gender.options.other')}</option>
                                                                        </select>
                                                                        {errors.students?.[index]?.gender?.message && (
                                                                                <motion.p
                                                                                        initial={{ opacity: 0, height: 0 }}
                                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                                        className="mt-1 text-sm text-red-500"
                                                                                >
                                                                                        {t(errors.students[index].gender.message)}
                                                                                </motion.p>
                                                                        )}
                                                                </div>

                                                                <div>
                                                                        <label className="mb-2 block text-sm font-light">
                                                                                {t('register.form.student.skills.label')} <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <div className="space-y-4">
                                                                                <div className="flex flex-wrap gap-2">
                                                                                        {Array.isArray(watch(`students.${index}.skills`)) && (watch(`students.${index}.skills`) as string[]).map((skill: string, skillIndex: number) => (
                                                                                                <div
                                                                                                        key={skillIndex}
                                                                                                        className="flex items-center gap-1 rounded-full bg-hackathon-gray px-3 py-1 text-sm"
                                                                                                >
                                                                                                        {skill}
                                                                                                        <button
                                                                                                                type="button"
                                                                                                                onClick={() => {
                                                                                                                        const currentSkills = watch(`students.${index}.skills`) as string[];
                                                                                                                        setValue(
                                                                                                                                `students.${index}.skills`,
                                                                                                                                currentSkills.filter((_, i) => i !== skillIndex)
                                                                                                                        );
                                                                                                                }}
                                                                                                                className="ml-1 text-gray-400 hover:text-white"
                                                                                                        >
                                                                                                                ×
                                                                                                        </button>
                                                                                                </div>
                                                                                        ))}
                                                                                </div>
                                                                                <div className="flex gap-2">
                                                                                        <select
                                                                                                className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.students?.[index]?.skills ? 'border-red-500' : ''}`}
                                                                                                onChange={(e) => {
                                                                                                        if (e.target.value) {
                                                                                                                const currentSkills = (watch(`students.${index}.skills`) as string[]) || [];
                                                                                                                if (!currentSkills.includes(e.target.value)) {
                                                                                                                        setValue(`students.${index}.skills`, [...currentSkills, e.target.value]);
                                                                                                                }
                                                                                                                e.target.value = '';
                                                                                                        }
                                                                                                }}
                                                                                        >
                                                                                                <option value="" className="bg-hackathon-black">{t('register.form.student.skills.placeholder')}</option>
                                                                                                <option value="Programming" className="bg-hackathon-black">{t('register.form.student.skills.options.programming')}</option>
                                                                                                <option value="UI/UX Design" className="bg-hackathon-black">{t('register.form.student.skills.options.uiux')}</option>
                                                                                                <option value="Presentation" className="bg-hackathon-black">{t('register.form.student.skills.options.presentation')}</option>
                                                                                                <option value="Prompt Engineering" className="bg-hackathon-black">{t('register.form.student.skills.options.prompt')}</option>
                                                                                                <option value="Product Design" className="bg-hackathon-black">{t('register.form.student.skills.options.product')}</option>
                                                                                                <option value="Business" className="bg-hackathon-black">{t('register.form.student.skills.options.business')}</option>
                                                                                        </select>
                                                                                        <input
                                                                                                type="text"
                                                                                                placeholder={t('register.form.student.skills.placeholder')}
                                                                                                className="flex-1 border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white"
                                                                                                onKeyDown={(e) => {
                                                                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                                                                                e.preventDefault();
                                                                                                                const input = e.currentTarget;
                                                                                                                const value = input.value.trim();
                                                                                                                if (value) {
                                                                                                                        const currentSkills = (watch(`students.${index}.skills`) as string[]) || [];
                                                                                                                        if (!currentSkills.includes(value)) {
                                                                                                                                setValue(`students.${index}.skills`, [...currentSkills, value]);
                                                                                                                        }
                                                                                                                        input.value = '';
                                                                                                                }
                                                                                                        }
                                                                                                }}
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                        {errors.students?.[index]?.skills?.message && (
                                                                                <motion.p
                                                                                        initial={{ opacity: 0, height: 0 }}
                                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                                        className="mt-1 text-sm text-red-500"
                                                                                >
                                                                                        {t(errors.students[index].skills.message)}
                                                                                </motion.p>
                                                                        )}
                                                                </div>

                                                                <div>
                                                                        <label className="mb-2 block text-sm font-light">{t('register.form.student.extra.label')}</label>
                                                                        <input
                                                                                type="text"
                                                                                {...register(`students.${index}.extra`)}
                                                                                placeholder={t('register.form.student.extra.placeholder')}
                                                                                className="w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white"
                                                                        />
                                                                </div>
                                                        </div>
                                                </div>
                                        ))}

                                        <button
                                                type="submit"
                                                className="btn-submit w-full bg-hackathon-gray p-3 text-center font-light hover:bg-opacity-80 disabled:opacity-50"
                                                disabled={submitting}
                                        >
                                                {submitting ? (
                                                        <span className="flex items-center justify-center">
                                                                <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                </svg>
                                                                {t('register.submit.processing')}
                                                        </span>
                                                ) : t('register.submit.button')}
                                        </button>
                                </motion.form>
                        </motion.div>
                </div>
        );
};

export default RegisterTeacher;
