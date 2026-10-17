import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import { categoryOptions, contactPayload } from './contacts.js'

const fieldClass = 'form-input'

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
    <main className="page-shell max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-brand">{t('contacts.title')}</h1>
      <form className="grid max-w-xl gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="grid gap-1.5 text-sm font-medium text-text">
          {t('contacts.fullName')}
          <input type="text" className={fieldClass} {...register('full_name', { required: true })} />
          {errors.full_name && <span className="text-sm text-error">{t('contacts.required')}</span>}
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-text">
          {t('contacts.email')}
          <input type="email" className={fieldClass} {...register('email', { required: true })} />
          {errors.email && <span className="text-sm text-error">{t('contacts.required')}</span>}
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-text">
          {t('contacts.whatsapp')}
          <input type="text" className={fieldClass} {...register('whatsapp')} />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-text">
          {t('contacts.country')}
          <input type="text" className={fieldClass} {...register('country')} />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-text">
          {t('contacts.category')}
          <select className={fieldClass} {...register('category')}>
            <option value="">{t('contacts.selectCategory')}</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-text">
          {t('contacts.message')}
          <textarea
            className={`${fieldClass} min-h-[150px] resize-y`}
            {...register('message', { required: true })}
            rows={4}
          />
          {errors.message && <span className="text-sm text-error">{t('contacts.required')}</span>}
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="about-hover-lift-xs w-fit cursor-pointer rounded-md border border-brand bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {t('contacts.send')}
        </button>
      </form>
      {status === 'success' && <p className="mt-4 text-success">{t('contacts.success')}</p>}
      {status === 'error' && <p className="mt-4 text-error">{t('contacts.error')}</p>}
    </main>
  )
}
