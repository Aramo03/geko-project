import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { getCommentPayload } from './commentForm.js'
import './commentForm.css'

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
    <form className="comment-form" onSubmit={handleSubmit(onSubmit)}>
      <label>
        {t('comments.fullName')}
        <input type="text" {...register('full_name', { required: true })} />
        {errors.full_name && <span className="error">{t('comments.required')}</span>}
      </label>
      <label>
        {t('comments.email')}
        <input type="email" {...register('email', { required: true })} />
        {errors.email && <span className="error">{t('comments.required')}</span>}
      </label>
      <label>
        {t('comments.whatsapp')}
        <input type="text" {...register('whatsapp')} />
      </label>
      <label>
        {t('comments.text')}
        <textarea {...register('text', { required: true })} rows={4} />
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
