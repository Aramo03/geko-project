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

  return (
    <form className="comment-form" onSubmit={handleSubmit(onSubmit)}>
      <label>
        {t('comments.fullName')}
        <input {...register('full_name', { required: true })} />
        {errors.full_name && <span className="error">{t('comments.required')}</span>}
      </label>
      <label>
        {t('comments.email')}
        <input type="email" {...register('email', { required: true })} />
        {errors.email && <span className="error">{t('comments.required')}</span>}
      </label>
      <label>
        {t('comments.whatsapp')}
        <input {...register('whatsapp')} />
      </label>
      <label>
        {t('comments.text')}
        <textarea rows={4} {...register('text', { required: true })} />
        {errors.text && <span className="error">{t('comments.required')}</span>}
      </label>
      <button type="submit" disabled={isSubmitting}>
        {t('comments.send')}
      </button>
      {status === 'success' && <p className="success">{t('comments.success')}</p>}
      {status === 'error' && <p className="error">{t('comments.error')}</p>}
    </form>
  )
}
