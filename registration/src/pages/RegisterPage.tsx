import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../lib/schemas/register';
import { supabase } from '../lib/supabase';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
    resolver: zodResolver(registerSchema),
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
        age: undefined,
        gender: undefined,
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

  // Store registration in localStorage
  const storeRegistrationLocally = (data: RegisterFormData) => {
    try {
      const existingData = localStorage.getItem('registrations');
      const registrations = existingData ? JSON.parse(existingData) : [];
      registrations.push({
        ...data,
        timestamp: new Date().toISOString(),
        synced: false
      });
      localStorage.setItem('registrations', JSON.stringify(registrations));
    } catch (error) {
      console.error('Failed to store registration locally:', error);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      // Store locally first
      storeRegistrationLocally(data);

      // Format the data for Supabase to match database schema
      const supabaseData = {
        school_name: data.schoolName,
        teacher_name: data.teacherName,
        contact_email: data.contact.email,
        contact_phone: data.contact.phone,
        contact_wechat: data.contact.wechat,
        student_count: data.studentCount,
        students: data.students,
        created_at: new Date().toISOString()
      };

      console.log('Submitting registration data:', supabaseData);

      // Then try Supabase
      const { error } = await supabase
        .from('registrations')
        .insert([supabaseData]);

      if (error) {
        console.warn('Supabase submission failed, but data is stored locally:', error);
        throw error; // Re-throw to trigger catch block
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.warn('Error during registration:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred during registration');
    } finally {
      setSubmitting(false);
    }
  };

  // hide logo animation and show form after
  const [showLogo, setShowLogo] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {showLogo ? (
          <div className="fixed inset-0 z-50 h-screen flex items-start justify-center bg-hackathon-black">
            <motion.div
              className="mt-[40vh]"
              key="logo"
              initial={{ opacity: 0, scale: 0.8, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <img
                src="/logofull.svg"
                alt="Hackathon Logo"
                className="h-32 w-auto"
              />
            </motion.div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-12">
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 text-center"
              >
                <h1 className="mb-3 text-3xl font-light tracking-wider">{t('register.title')}</h1>
                <p className="mx-auto max-w-lg text-lg font-light text-gray-400">
                  {t('register.subtitle')}
                </p>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="mx-auto w-full max-w-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {submitError && (
                  <div className="mb-6 rounded bg-red-500/10 p-4 text-red-500">
                    {submitError}
                  </div>
                )}

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
                        <label className="mb-2 block text-sm font-light">{t('register.form.student.skills.label')}</label>
                        <select
                          {...register(`students.${index}.skills.0`)}
                          className={`w-full border-hackathon-lightgray bg-transparent p-2 font-light focus:border-hackathon-white ${errors.students?.[index]?.skills ? 'border-red-500' : ''}`}
                        >
                          <option value="" className="bg-hackathon-black">{t('register.form.student.skills.placeholder')}</option>
                          <option value="Programming" className="bg-hackathon-black">{t('register.form.student.skills.options.programming')}</option>
                          <option value="UI/UX Design" className="bg-hackathon-black">{t('register.form.student.skills.options.uiux')}</option>
                          <option value="Presentation" className="bg-hackathon-black">{t('register.form.student.skills.options.presentation')}</option>
                          <option value="Prompt Engineering" className="bg-hackathon-black">{t('register.form.student.skills.options.prompt')}</option>
                          <option value="Product Design" className="bg-hackathon-black">{t('register.form.student.skills.options.product')}</option>
                          <option value="Business" className="bg-hackathon-black">{t('register.form.student.skills.options.business')}</option>
                        </select>
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
                      {/* <div>
                <label className="mb-2 block text-sm font-light">
                  {t('register.form.student.hackathonExperience.label')}
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      {...register(`students.${index}.hackathonExperience`, {
                        setValueAs: (value) => value === "true"
                      })}
                      value="true"
                      className="text-hackathon-white focus:ring-hackathon-white"
                    />
                    <span>{t('register.form.student.hackathonExperience.yes')}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      {...register(`students.${index}.hackathonExperience`, {
                        setValueAs: (value) => value === "true"
                      })}
                      value="false"
                      className="text-hackathon-white focus:ring-hackathon-white"
                    />
                    <span>{t('register.form.student.hackathonExperience.no')}</span>
                  </label>
                </div>
              </div> */}
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

              {/* Success Modal */}
              <AnimatePresence>
                {showSuccessModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                    onClick={() => setShowSuccessModal(false)}
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
                        onClick={() => setShowSuccessModal(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      <div className="mb-4 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>

                      <h3 className="mb-2 text-xl font-light">{t('register.submit.success.title')}</h3>
                      <p className="mb-6 text-gray-300">
                        {t('register.submit.success.message')}
                      </p>

                      <button
                        className="w-full bg-hackathon-black p-3 text-center font-light transition hover:bg-opacity-80"
                        onClick={() => setShowSuccessModal(false)}
                      >
                        {t('register.submit.success.close')}
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegisterPage;
