import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import {
  COMMENT_FIELDS,
  EMAIL_PATTERN,
  getCommentPayload,
  invalidFieldName,
} from './commentForm.js'
import './commentForm.css'

export default function CommentForm({ category, popularCourse, onCreated }) {
  const { t } = useTranslation()
  const statusRef = useRef(null)
  const errorsRef = useRef({})
  const busy = useRef(false)
  const [status, setStatus] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting, submitCount },
  } = useForm()

  errorsRef.current = errors

  useEffect(() => {
    if (!submitCount) return
    const name = invalidFieldName(errorsRef.current, COMMENT_FIELDS)
    if (name) setFocus(name)
  }, [submitCount, setFocus])

  useEffect(() => {
    if (!status) return
    statusRef.current?.focus()
  }, [status])

  async function onSubmit(data) {
    if (busy.current) return
    busy.current = true
    setStatus(null)
    const payload = getCommentPayload(data, category, popularCourse)
    if (!payload) {
      setStatus('error')
      busy.current = false
      return
    }

    try {
      await api.post('/api/comments/', payload)
      reset()
      setStatus('success')
      if (onCreated) onCreated()
    } catch {
      setStatus('error')
    } finally {
      busy.current = false
    }
  }

  return (
    <form
      className="contact-form comment-form"
      onSubmit={handleSubmit(onSubmit, () => setStatus(null))}
      noValidate
    >
      <h2 className="contact-form-title">{t('comments.formTitle')}</h2>
      <p className="comment-form-lead">{t('comments.formLead')}</p>

      <div className="contact-form-grid">
        <label className="contact-field" htmlFor="comment-full-name">
          <span>
            {t('comments.fullName')}{' '}
            <span className="contact-required" aria-hidden="true">*</span>
          </span>
          <input
            id="comment-full-name"
            type="text"
            autoComplete="name"
            aria-required="true"
            aria-invalid={errors.full_name ? 'true' : 'false'}
            aria-describedby={errors.full_name ? 'comment-full-name-error' : undefined}
            {...register('full_name', { required: true })}
          />
          {errors.full_name ? (
            <span id="comment-full-name-error" className="contact-error">
              {t('comments.required')}
            </span>
          ) : null}
        </label>

        <label className="contact-field" htmlFor="comment-email">
          <span>
            {t('comments.email')}{' '}
            <span className="contact-required" aria-hidden="true">*</span>
          </span>
          <input
            id="comment-email"
            type="email"
            autoComplete="email"
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'comment-email-error' : undefined}
            {...register('email', { required: true, pattern: EMAIL_PATTERN })}
          />
          {errors.email ? (
            <span id="comment-email-error" className="contact-error">
              {errors.email.type === 'pattern'
                ? t('comments.invalidEmail')
                : t('comments.required')}
            </span>
          ) : null}
        </label>

        <label className="contact-field" htmlFor="comment-whatsapp">
          <span>{t('comments.whatsapp')}</span>
          <input
            id="comment-whatsapp"
            type="tel"
            autoComplete="tel"
            aria-invalid="false"
            {...register('whatsapp')}
          />
        </label>

        <label className="contact-field contact-field-wide" htmlFor="comment-text">
          <span>
            {t('comments.text')}{' '}
            <span className="contact-required" aria-hidden="true">*</span>
          </span>
          <textarea
            id="comment-text"
            rows={5}
            aria-required="true"
            aria-invalid={errors.text ? 'true' : 'false'}
            aria-describedby={errors.text ? 'comment-text-error' : undefined}
            {...register('text', { required: true })}
          />
          {errors.text ? (
            <span id="comment-text-error" className="contact-error">
              {t('comments.required')}
            </span>
          ) : null}
        </label>
      </div>

      <button type="submit" aria-busy={isSubmitting ? 'true' : 'false'}>
        {isSubmitting ? t('comments.sending') : t('comments.send')}
      </button>

      {status === 'success' ? (
        <p
          ref={statusRef}
          id="comment-form-status"
          className="contact-status contact-status-success"
          role="status"
          tabIndex={-1}
        >
          {t('comments.success')}
        </p>
      ) : null}
      {status === 'error' ? (
        <p
          ref={statusRef}
          id="comment-form-status"
          className="contact-status contact-status-error"
          role="alert"
          tabIndex={-1}
        >
          {t('comments.error')}
        </p>
      ) : null}
    </form>
  )
}
