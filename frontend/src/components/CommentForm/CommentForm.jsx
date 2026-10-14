import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { commentPayload } from './commentForm.js'
import './commentForm.css'

export default function CommentForm({ categoryId, popularCourseId }) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()
  const [status, setStatus] = useState(null)

  async function onSubmit(values) {
    setStatus(null)
    try {
      await api.post('/api/comments/', commentPayload({ values, categoryId, popularCourseId }))
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  const fieldClass =
    'mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0a5c36]'

  return (
    <form className="mt-4 flex max-w-xl flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="flex flex-col text-sm font-medium text-gray-700">
        {t('comments.fullName')}
        <input className={fieldClass} {...register('full_name', { required: true })} />
        {errors.full_name && <span className="mt-1 text-xs text-red-500">{t('comments.required')}</span>}
      </label>
      <label className="flex flex-col text-sm font-medium text-gray-700">
        {t('comments.email')}
        <input type="email" className={fieldClass} {...register('email', { required: true })} />
        {errors.email && <span className="mt-1 text-xs text-red-500">{t('comments.required')}</span>}
      </label>
      <label className="flex flex-col text-sm font-medium text-gray-700">
        {t('comments.whatsapp')}
        <input className={fieldClass} {...register('whatsapp')} />
      </label>
      <label className="flex flex-col text-sm font-medium text-gray-700">
        {t('comments.text')}
        <textarea rows={4} className={fieldClass} {...register('text', { required: true })} />
        {errors.text && <span className="mt-1 text-xs text-red-500">{t('comments.required')}</span>}
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-lg bg-[#0a5c36] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#074628] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {t('comments.send')}
      </button>
      {status === 'success' && <p className="text-sm text-[#0a5c36]">{t('comments.success')}</p>}
      {status === 'error' && <p className="text-sm text-red-500">{t('comments.error')}</p>}
    </form>
  )
}