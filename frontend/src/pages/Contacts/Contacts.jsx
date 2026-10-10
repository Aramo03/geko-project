import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { categoryOptions, contactPayload } from './contacts.js'
import './contacts.css'

export default function Contacts() {
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

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
    <main className="page contacts-page">
      <h1>{t('contacts.title')}</h1>
      <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
        <label>
          {t('contacts.fullName')}
          <input type="text" {...register('full_name', { required: true })} />
          {errors.full_name && <span className="error">{t('contacts.required')}</span>}
        </label>
        <label>
          {t('contacts.email')}
          <input type="email" {...register('email', { required: true })} />
          {errors.email && <span className="error">{t('contacts.required')}</span>}
        </label>
        <label>
          {t('contacts.whatsapp')}
          <input type="text" {...register('whatsapp')} />
        </label>
        <label>
          {t('contacts.country')}
          <input type="text" {...register('country')} />
        </label>
        <label>
          {t('contacts.category')}
          <select {...register('category')}>
            <option value="">{t('contacts.selectCategory')}</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
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
