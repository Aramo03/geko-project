
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

  if (
    popularCourse === undefined ||
    popularCourse === null ||
    popularCourse === ''
  ) {
    return null
  }

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
      onCreated?.()
    } catch (error) {
      console.error(
        'Comment creation failed:',
        error.response?.data || error.message,
      )
      setStatus('error')
    }
  }

  return (
    <form
      className="contact-form comment-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h2 className="contact-form-title">
        {t('comments.formTitle')}
      </h2>

      <p className="comment-form-lead">
        {t('comments.formLead')}
      </p>

      <div className="contact-form-grid">
        <label className="contact-field">
          <span>
            {t('comments.fullName')}{' '}
            <span className="contact-required" aria-hidden="true">*</span>
          </span>

          <input
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.full_name)}
            {...register('full_name', { required: true })}
          />

          {errors.full_name && (
            <span className="contact-error">
              {t('comments.required')}
            </span>
          )}
        </label>

        <label className="contact-field">
          <span>
            {t('comments.email')}{' '}
            <span className="contact-required" aria-hidden="true">*</span>
          </span>

          <input
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register('email', {
              required: true,
              pattern: EMAIL_PATTERN,
            })}
          />

          {errors.email && (
            <span className="contact-error">
              {errors.email.type === 'pattern'
                ? t('comments.invalidEmail')
                : t('comments.required')}
            </span>
          )}
        </label>

        <label className="contact-field">
          <span>{t('comments.whatsapp')}</span>
          <input
            type="tel"
            autoComplete="tel"
            {...register('whatsapp')}
          />
        </label>

        <label className="contact-field contact-field-wide">
          <span>
            {t('comments.text')}{' '}
            <span className="contact-required" aria-hidden="true">*</span>
          </span>

          <textarea
            rows={5}
            aria-invalid={Boolean(errors.text)}
            {...register('text', { required: true })}
          />

          {errors.text && (
            <span className="contact-error">
              {t('comments.required')}
            </span>
          )}
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? t('comments.sending')
          : t('comments.send')}
      </button>

      {status === 'success' && (
        <p
          className="contact-status contact-status-success"
          role="status"
        >
          {t('comments.success')}
        </p>
      )}

      {status === 'error' && (
        <p
          className="contact-status contact-status-error"
          role="alert"
        >
          {t('comments.error')}
        </p>
      )}
    </form>
  )
}
