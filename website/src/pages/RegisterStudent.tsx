import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, type StudentFormData } from '../lib/schemas/register';
import { submitStudentRegistration } from '../lib/api/registration';

interface RegisterStudentProps {
        onSuccess: () => void;
}

const RegisterStudent = ({ onSuccess }: RegisterStudentProps) => {
        const { t } = useTranslation();
        const [submitting, setSubmitting] = useState(false);
        const [submitError, setSubmitError] = useState<string | null>(null);

        const {
                register,
                handleSubmit,
                setValue,
                watch,
                formState: { errors }
        } = useForm<StudentFormData>({
                resolver: zodResolver(studentSchema),
                defaultValues: {
                        realName: '',
                        preferredName: '',
                        age: undefined,
                        gender: undefined,
                        email: '',
                        phoneNumber: '',
                        wechatId: '',
                        school: '',
                        grade: '',
                        skills: [],
                        experience: '',
                        links: ''
                }
        });

        const onSubmit = async (data: StudentFormData) => {
                if (submitting || submitError) return; // Prevent submission if there's an error

                try {
                        setSubmitting(true);
                        setSubmitError(null);

                        await submitStudentRegistration(data);
                        setSubmitting(false); // Reset submitting state on success
                        onSuccess();
                } catch (error) {
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
                        return false; // Prevent form from submitting again
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

                                        {/* Basic Information */}
                                        <div className="mb-8 rounded-lg border border-hackathon-lightgray p-6">
                                                <h3 className="mb-6 text-xl font-light">{t('register.form.studentForm.basic')}</h3>
                                                <div className="space-y-6">
                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">
                                                                        {t('register.form.studentForm.realName.label')} <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                        type="text"
                                                                        {...register('realName')}
                                                                        placeholder={t('register.form.studentForm.realName.placeholder')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.realName ? 'border-red-500' : ''}`}
                                                                />
                                                                {errors.realName?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.realName.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>

                                                        <div className="mb-6">
                                                                <label className="mb-2 block text-sm font-light">{t('register.form.studentForm.preferredName.label')}</label>
                                                                <input
                                                                        type="text"
                                                                        {...register('preferredName')}
                                                                        placeholder={t('register.form.studentForm.preferredName.placeholder')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.preferredName ? 'border-red-500' : ''}`}
                                                                />
                                                                {errors.preferredName?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.preferredName.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>

                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">
                                                                        {t('register.form.studentForm.age.label')} <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                        type="number"
                                                                        {...register('age', { valueAsNumber: true })}
                                                                        placeholder={t('register.form.studentForm.age.placeholder')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.age ? 'border-red-500' : ''}`}
                                                                />
                                                                {errors.age?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.age.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>

                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">
                                                                        {t('register.form.studentForm.gender.label')} <span className="text-red-500">*</span>
                                                                </label>
                                                                <select
                                                                        {...register('gender')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white text-gray-400 ${errors.gender ? 'border-red-500' : ''}`}
                                                                >
                                                                        <option value="" className="bg-hackathon-black text-white">{t('register.form.studentForm.gender.placeholder')}</option>
                                                                        <option value="male" className="bg-hackathon-black text-white">{t('register.form.studentForm.gender.options.male')}</option>
                                                                        <option value="female" className="bg-hackathon-black text-white">{t('register.form.studentForm.gender.options.female')}</option>
                                                                        <option value="other" className="bg-hackathon-black text-white">{t('register.form.studentForm.gender.options.other')}</option>
                                                                </select>
                                                                {errors.gender?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.gender.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>

                                                </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="mb-8 rounded-lg border border-hackathon-lightgray p-6">
                                                <h3 className="mb-6 text-xl font-light">{t('register.form.studentForm.contact.label')}</h3>
                                                <p className="mb-4 text-sm text-gray-400">{t('register.form.studentForm.contact.sublabel')}</p>
                                                <div className="space-y-6">
                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">{t('register.form.contact.email.label')}</label>
                                                                <input
                                                                        type="email"
                                                                        {...register('email')}
                                                                        placeholder={t('register.form.studentForm.contact.email.placeholder')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.email ? 'border-red-500' : ''}`}
                                                                />
                                                                {errors.email?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.email.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>
                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">{t('register.form.contact.phone.label')}</label>
                                                                <input
                                                                        type="text"
                                                                        {...register('phoneNumber')}
                                                                        placeholder={t('register.form.studentForm.contact.phone.placeholder')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.phoneNumber ? 'border-red-500' : ''}`}
                                                                />
                                                                {errors.phoneNumber?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.phoneNumber.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>
                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">{t('register.form.contact.wechat.label')}</label>
                                                                <input
                                                                        type="text"
                                                                        {...register('wechatId')}
                                                                        placeholder={t('register.form.studentForm.contact.wechat.placeholder')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.wechatId ? 'border-red-500' : ''}`}
                                                                />
                                                                {errors.wechatId?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.wechatId.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>
                                                </div>
                                        </div>

                                        {/* School Information */}
                                        <div className="mb-8 rounded-lg border border-hackathon-lightgray p-6">
                                                <h3 className="mb-6 text-xl font-light">{t('register.form.studentForm.school.label')}</h3>
                                                <div className="space-y-6">
                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">
                                                                        {t('register.form.studentForm.school.label')} <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                        type="text"
                                                                        {...register('school')}
                                                                        placeholder={t('register.form.studentForm.school.placeholder')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.school ? 'border-red-500' : ''}`}
                                                                />
                                                                {errors.school?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.school.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>

                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">{t('register.form.studentForm.grade.label')}</label>
                                                                <input
                                                                        type="text"
                                                                        {...register('grade')}
                                                                        placeholder={t('register.form.studentForm.grade.placeholder')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.grade ? 'border-red-500' : ''}`}
                                                                />
                                                                {errors.grade?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.grade.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Skills and Experience */}
                                        <div className="mb-8 rounded-lg border border-hackathon-lightgray p-6">
                                                <h3 className="mb-6 text-xl font-light">{t('register.form.studentForm.skills.label')}</h3>
                                                <div className="space-y-6">
                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">
                                                                        {t('register.form.studentForm.skills.label')} <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="space-y-4">
                                                                        <div className="flex flex-wrap gap-2">
                                                                                {Array.isArray(watch('skills')) && (watch('skills') as string[]).map((skill: string, index: number) => (
                                                                                        <div
                                                                                                key={index}
                                                                                                className="flex items-center gap-1 rounded-full bg-hackathon-gray px-3 py-1 text-sm"
                                                                                        >
                                                                                                {skill}
                                                                                                <button
                                                                                                        type="button"
                                                                                                        onClick={() => {
                                                                                                                const currentSkills = watch('skills') as string[];
                                                                                                                setValue(
                                                                                                                        'skills',
                                                                                                                        currentSkills.filter((_, i) => i !== index)
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
                                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.skills ? 'border-red-500' : ''}`}
                                                                                        onChange={(e) => {
                                                                                                if (e.target.value) {
                                                                                                        const currentSkills = (watch('skills') as string[]) || [];
                                                                                                        if (!currentSkills.includes(e.target.value)) {
                                                                                                                setValue('skills', [...currentSkills, e.target.value]);
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
                                                                                        placeholder={t('register.form.studentForm.skills.placeholder2')}
                                                                                        className="flex-1 border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white"
                                                                                        onKeyDown={(e) => {
                                                                                                if (e.key === 'Enter' || e.key === ' ') {
                                                                                                        e.preventDefault();
                                                                                                        const input = e.currentTarget;
                                                                                                        const value = input.value.trim();
                                                                                                        if (value) {
                                                                                                                const currentSkills = (watch('skills') as string[]) || [];
                                                                                                                if (!currentSkills.includes(value)) {
                                                                                                                        setValue('skills', [...currentSkills, value]);
                                                                                                                }
                                                                                                                input.value = '';
                                                                                                        }
                                                                                                }
                                                                                        }}
                                                                                />
                                                                        </div>
                                                                </div>
                                                                {errors.skills?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.skills.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>

                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">{t('register.form.studentForm.experience.label')}</label>
                                                                <textarea
                                                                        {...register('experience')}
                                                                        placeholder={t('register.form.studentForm.experience.placeholder')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.experience ? 'border-red-500' : ''}`}
                                                                        rows={4}
                                                                />
                                                                {errors.experience?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.experience.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>

                                                        <div>
                                                                <label className="mb-2 block text-sm font-light">{t('register.form.studentForm.links.label')}</label>
                                                                <p className="mb-2 text-sm text-gray-400">{t('register.form.studentForm.links.sublabel')}</p>
                                                                <textarea
                                                                        {...register('links')}
                                                                        placeholder={t('register.form.studentForm.links.placeholder')}
                                                                        className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.links ? 'border-red-500' : ''}`}
                                                                        rows={4}
                                                                />
                                                                {errors.links?.message && (
                                                                        <motion.p
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                className="mt-1 text-sm text-red-500"
                                                                        >
                                                                                {t(errors.links.message)}
                                                                        </motion.p>
                                                                )}
                                                        </div>
                                                </div>
                                        </div>

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

export default RegisterStudent;
