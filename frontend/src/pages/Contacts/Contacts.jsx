import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { api } from '../../api/client.js'
import { useUiBlocks } from '../../lib/uiBlocks.jsx'
import {
  CONTACT_FIELDS,
  EMAIL_PATTERN,
  categoryOptions,
  contactDetails,
  contactPayload,
  invalidFieldName,
  telHref,
} from './contacts.js'
import './contacts.css'

export default function Contacts() {
  const { t, i18n } = useTranslation()
  const { blocks } = useUiBlocks()
  const statusRef = useRef(null)
  const errorsRef = useRef({})
  const busy = useRef(false)
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting, submitCount },
  } = useForm()

  errorsRef.current = errors

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

  useEffect(() => {
    if (!submitCount) return
    const name = invalidFieldName(errorsRef.current, CONTACT_FIELDS)
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
    try {
      await api.post('/api/contact/', contactPayload(data))
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    } finally {
      busy.current = false
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

          <form
            className="contact-form"
            onSubmit={handleSubmit(onSubmit, () => setStatus(null))}
            noValidate
          >
            <h2 className="contact-form-title">{t('contacts.formTitle')}</h2>
            <div className="contact-form-grid">
              <label className="contact-field" htmlFor="contact-full-name">
                <span>
                  {t('contacts.fullName')}{' '}
                  <span className="contact-required" aria-hidden="true">*</span>
                </span>
                <input
                  id="contact-full-name"
                  type="text"
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={errors.full_name ? 'true' : 'false'}
                  aria-describedby={errors.full_name ? 'contact-full-name-error' : undefined}
                  {...register('full_name', { required: true })}
                />
                {errors.full_name ? (
                  <span id="contact-full-name-error" className="contact-error">
                    {t('contacts.required')}
                  </span>
                ) : null}
              </label>

              <label className="contact-field" htmlFor="contact-email">
                <span>
                  {t('contacts.email')}{' '}
                  <span className="contact-required" aria-hidden="true">*</span>
                </span>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  {...register('email', { required: true, pattern: EMAIL_PATTERN })}
                />
                {errors.email ? (
                  <span id="contact-email-error" className="contact-error">
                    {errors.email.type === 'pattern'
                      ? t('contacts.invalidEmail')
                      : t('contacts.required')}
                  </span>
                ) : null}
              </label>

              <label className="contact-field" htmlFor="contact-whatsapp">
                <span>{t('contacts.whatsapp')}</span>
                <input
                  id="contact-whatsapp"
                  type="tel"
                  autoComplete="tel"
                  aria-invalid="false"
                  {...register('whatsapp')}
                />
              </label>

              <label className="contact-field" htmlFor="contact-country">
                <span>{t('contacts.country')}</span>
                <input
                  id="contact-country"
                  type="text"
                  autoComplete="country-name"
                  aria-invalid="false"
                  {...register('country')}
                />
              </label>

              <label className="contact-field contact-field-wide" htmlFor="contact-category">
                <span>{t('contacts.category')}</span>
                <select id="contact-category" aria-invalid="false" {...register('category')}>
                  <option value="">{t('contacts.selectCategory')}</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="contact-field contact-field-wide" htmlFor="contact-message">
                <span>
                  {t('contacts.message')}{' '}
                  <span className="contact-required" aria-hidden="true">*</span>
                </span>
                <textarea
                  id="contact-message"
                  rows={5}
                  aria-required="true"
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  {...register('message', { required: true })}
                />
                {errors.message ? (
                  <span id="contact-message-error" className="contact-error">
                    {t('contacts.required')}
                  </span>
                ) : null}
              </label>
            </div>

            <button type="submit" aria-busy={isSubmitting ? 'true' : 'false'}>
              {isSubmitting ? t('contacts.sending') : t('contacts.send')}
            </button>

            {status === 'success' ? (
              <p
                ref={statusRef}
                id="contact-form-status"
                className="contact-status contact-status-success"
                role="status"
                tabIndex={-1}
              >
                {t('contacts.success')}
              </p>
            ) : null}
            {status === 'error' ? (
              <p
                ref={statusRef}
                id="contact-form-status"
                className="contact-status contact-status-error"
                role="alert"
                tabIndex={-1}
              >
                {t('contacts.error')}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </main>
  )
}
