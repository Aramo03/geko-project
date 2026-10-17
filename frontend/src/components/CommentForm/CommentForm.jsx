import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { getCommentPayload } from './commentForm.js'

const fieldClass = 'form-input'

export default function CommentForm({ category, popularCourse, onCreated }) {
  const { t } = useTranslation()
  const [status, setStatus] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(data) {
    setStatus(null)
    const payload = getCommentPayload(data, category, popularCourse)
    if (!payload) {
      setStatus('error')
      return
    }
    try {
      await api.post('/api/comments/', payload)
      reset()
      setStatus('success')
      if (onCreated) onCreated()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="grid gap-1.5 text-sm font-medium text-text">
        {t('comments.fullName')}
        <input type="text" className={fieldClass} {...register('full_name', { required: true })} />
        {errors.full_name && <span className="text-sm text-error">{t('comments.required')}</span>}
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-text">
        {t('comments.email')}
        <input type="email" className={fieldClass} {...register('email', { required: true })} />
        {errors.email && <span className="text-sm text-error">{t('comments.required')}</span>}
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-text">
        {t('comments.whatsapp')}
        <input type="text" className={fieldClass} {...register('whatsapp')} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-text">
        {t('comments.text')}
        <textarea
          className={`${fieldClass} min-h-[120px] resize-y`}
          {...register('text', { required: true })}
          rows={4}
        />
        {errors.text && <span className="text-sm text-error">{t('comments.required')}</span>}
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="about-hover-lift-xs w-fit cursor-pointer rounded-md border border-brand bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {t('comments.send')}
      </button>
      {status === 'success' && <p className="text-success">{t('comments.success')}</p>}
      {status === 'error' && <p className="text-error">{t('comments.error')}</p>}
    </form>
  )
}
