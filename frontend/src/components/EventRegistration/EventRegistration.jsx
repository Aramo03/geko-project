import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { eventLabel, registrationPayload } from './eventRegistration.js'
import './eventRegistration.css'

export default function EventRegistration({ events }) {
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
    try {
      await api.post('/api/contact/', registrationPayload(data, events, t('events.untitled')))
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="event-register">
      <h2 className="event-register__title">{t('events.register.title')}</h2>
      <form className="event-register__form" onSubmit={handleSubmit(onSubmit)}>
        <label>
          {t('events.register.event')}
          <select defaultValue="" {...register('event_id', { required: true })}>
            <option value="" disabled>
              {t('events.register.eventPlaceholder')}
            </option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {eventLabel(event, t('events.untitled'))}
              </option>
            ))}
          </select>
          {errors.event_id && <span className="event-register__error">{t('events.register.required')}</span>}
        </label>
        <label>
          {t('events.register.fullName')}
          <input
            type="text"
            placeholder={t('events.register.fullNamePlaceholder')}
            {...register('full_name', { required: true })}
          />
          {errors.full_name && <span className="event-register__error">{t('events.register.required')}</span>}
        </label>
        <label>
          {t('events.register.email')}
          <input
            type="email"
            placeholder={t('events.register.emailPlaceholder')}
            {...register('email', { required: true })}
          />
          {errors.email && <span className="event-register__error">{t('events.register.required')}</span>}
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('common.loading') : t('events.register.submit')}
        </button>
        {status === 'success' && (
          <p role="status" className="event-register__ok">{t('events.register.success')}</p>
        )}
        {status === 'error' && (
          <p role="alert" className="event-register__error">{t('events.register.error')}</p>
        )}
      </form>
    </section>
  )
}
