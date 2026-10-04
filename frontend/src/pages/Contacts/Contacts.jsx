import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import './contacts.css'

export default function Contacts() {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const [status, setStatus] = useState(null)

  async function onSubmit(data) {
    setStatus(null)
    try {
      await api.post('/api/contact/', data)
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="page contacts-page">
      <h1>{t('contacts.title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="contacts-form">
        <label>
          {t('contacts.fullName')}
          <input {...register('full_name', { required: true })} />
          {errors.full_name && <span className="error">{t('contacts.required')}</span>}
        </label>
        <label>
          {t('contacts.email')}
          <input type="email" {...register('email', { required: true })} />
          {errors.email && <span className="error">{t('contacts.required')}</span>}
        </label>
        <label>
          {t('contacts.phone')}
          <input {...register('phone')} />
        </label>
        <label>
          {t('contacts.message')}
          <textarea {...register('message', { required: true })} rows={4} />
          {errors.message && <span className="error">{t('contacts.required')}</span>}
        </label>
        <button type="submit" disabled={isSubmitting}>
          {t('contacts.send')}
        </button>
      </form>
      {status === 'success' && <p className="success">{t('contacts.success')}</p>}
      {status === 'error' && <p className="error">{t('contacts.error')}</p>}
    </main>
  )
}
