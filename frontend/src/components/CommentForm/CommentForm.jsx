import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { EMAIL_PATTERN, getCommentPayload } from './commentForm.js'
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
    <form className="comment-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="comment-form-title">{t('comments.formTitle')}</h2>
      <p className="comment-form-lead">{t('comments.formLead')}</p>

      <label className="comment-field">
        <span>
          {t('comments.fullName')}{' '}
          <span className="comment-required" aria-hidden="true">
            *
          </span>
        </span>
        <input
          type="text"
          autoComplete="name"
          aria-invalid={errors.full_name ? 'true' : 'false'}
          {...register('full_name', { required: true })}
        />
        {errors.full_name ? <span className="comment-error">{t('comments.required')}</span> : null}
      </label>

      <label className="comment-field">
        <span>
          {t('comments.email')}{' '}
          <span className="comment-required" aria-hidden="true">
            *
          </span>
        </span>
        <input
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          {...register('email', { required: true, pattern: EMAIL_PATTERN })}
        />
        {errors.email ? (
          <span className="comment-error">
            {errors.email.type === 'pattern' ? t('comments.invalidEmail') : t('comments.required')}
          </span>
        ) : null}
      </label>

      <label className="comment-field">
        <span>{t('comments.whatsapp')}</span>
        <input type="tel" autoComplete="tel" {...register('whatsapp')} />
      </label>

      <label className="comment-field">
        <span>
          {t('comments.text')}{' '}
          <span className="comment-required" aria-hidden="true">
            *
          </span>
        </span>
        <textarea
          rows={4}
          aria-invalid={errors.text ? 'true' : 'false'}
          {...register('text', { required: true })}
        />
        {errors.text ? <span className="comment-error">{t('comments.required')}</span> : null}
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('comments.sending') : t('comments.send')}
      </button>

      {status === 'success' ? (
        <p className="comment-status comment-status-success" role="status">
          {t('comments.success')}
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="comment-status comment-status-error" role="alert">
          {t('comments.error')}
        </p>
      ) : null}
    </form>
  )
}
