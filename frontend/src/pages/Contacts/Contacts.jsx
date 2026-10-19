import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { api } from '../../api/client.js'
import { useUiBlocks } from '../../lib/uiBlocks.jsx'
import {
  EMAIL_PATTERN,
  categoryOptions,
  contactDetails,
  contactPayload,
  telHref,
} from './contacts.js'
import './contacts.css'

export default function Contacts() {
  const { t, i18n } = useTranslation()
  const { blocks } = useUiBlocks()
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const details = contactDetails(blocks, t('contacts.addressLine'))

  useEffect(() => {
    let active = true
    api
      .get('/api/categories/')
      .then((res) => {
        if (active) setCategories(categoryOptions(res.data))
      })
      .catch(() => {
        if (active) setCategories([])
      })
    return () => {
      active = false
    }
  }, [i18n.language])

  async function onSubmit(data) {
    setStatus(null)
    try {
      await api.post('/api/contact/', contactPayload(data))
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="contacts-page">
      <div className="contacts-shell">
        <header className="contacts-intro">
          <p className="contacts-kicker">{t('contacts.kicker')}</p>
          <h1>{t('contacts.title')}</h1>
          <p className="contacts-lead">{t('contacts.lead')}</p>
        </header>

        <div className="contacts-layout">
          <aside className="contacts-aside">
            {details.phone ? (
              <article className="contacts-card">
                <span className="contacts-card-icon" aria-hidden="true">
                  <FaPhoneAlt size={13} />
                </span>
                <div>
                  <h2>{t('contacts.phone')}</h2>
                  <a href={telHref(details.phone)}>{details.phone}</a>
                </div>
              </article>
            ) : null}
            {details.email ? (
              <article className="contacts-card">
                <span className="contacts-card-icon" aria-hidden="true">
                  <FaEnvelope size={14} />
                </span>
                <div>
                  <h2>{t('contacts.email')}</h2>
                  <a href={`mailto:${details.email}`}>{details.email}</a>
                </div>
              </article>
            ) : null}
            {details.address ? (
              <article className="contacts-card">
                <span className="contacts-card-icon" aria-hidden="true">
                  <FaMapMarkerAlt size={14} />
                </span>
                <div>
                  <h2>{t('contacts.address')}</h2>
                  <p>{details.address}</p>
                  {details.map ? (
                    <a
                      className="contacts-map"
                      href={details.map}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('contacts.openMap')}
                    </a>
                  ) : null}
                </div>
              </article>
            ) : null}
          </aside>

          <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className="contact-form-title">{t('contacts.formTitle')}</h2>
            <div className="contact-form-grid">
              <label className="contact-field">
                <span>
                  {t('contacts.fullName')}{' '}
                  <span className="contact-required" aria-hidden="true">*</span>
                </span>
                <input
                  type="text"
                  autoComplete="name"
                  aria-invalid={errors.full_name ? 'true' : 'false'}
                  {...register('full_name', { required: true })}
                />
                {errors.full_name ? (
                  <span className="contact-error">{t('contacts.required')}</span>
                ) : null}
              </label>

              <label className="contact-field">
                <span>
                  {t('contacts.email')}{' '}
                  <span className="contact-required" aria-hidden="true">*</span>
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  {...register('email', { required: true, pattern: EMAIL_PATTERN })}
                />
                {errors.email ? (
                  <span className="contact-error">
                    {errors.email.type === 'pattern'
                      ? t('contacts.invalidEmail')
                      : t('contacts.required')}
                  </span>
                ) : null}
              </label>

              <label className="contact-field">
                <span>{t('contacts.whatsapp')}</span>
                <input type="tel" autoComplete="tel" {...register('whatsapp')} />
              </label>

              <label className="contact-field">
                <span>{t('contacts.country')}</span>
                <input type="text" autoComplete="country-name" {...register('country')} />
              </label>

              <label className="contact-field contact-field-wide">
                <span>{t('contacts.category')}</span>
                <select {...register('category')}>
                  <option value="">{t('contacts.selectCategory')}</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="contact-field contact-field-wide">
                <span>
                  {t('contacts.message')}{' '}
                  <span className="contact-required" aria-hidden="true">*</span>
                </span>
                <textarea
                  rows={5}
                  aria-invalid={errors.message ? 'true' : 'false'}
                  {...register('message', { required: true })}
                />
                {errors.message ? (
                  <span className="contact-error">{t('contacts.required')}</span>
                ) : null}
              </label>
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('contacts.sending') : t('contacts.send')}
            </button>

            {status === 'success' ? (
              <p className="contact-status contact-status-success" role="status">
                {t('contacts.success')}
              </p>
            ) : null}
            {status === 'error' ? (
              <p className="contact-status contact-status-error" role="alert">
                {t('contacts.error')}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </main>
  )
}
