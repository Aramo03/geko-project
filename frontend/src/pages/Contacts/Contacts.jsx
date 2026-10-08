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

  const onSubmit = async (data) => {
    try {
      await api.post('/api/contact/', data)

      alert(t('contacts.success'))
      reset()
    } catch (error) {
      console.error(error)
      alert(t('contacts.error'))
    }
  }

  return (
    <main className="page">
      <h1>{t('contacts.title')}</h1>

      <form
        className="contact-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Full name */}
        <label>
          {t('contacts.fullName')}

          <input
            type="text"
            {...register('full_name', {
              required: true,
            })}
          />

          {errors.full_name && (
            <span>{t('contacts.required')}</span>
          )}
        </label>

        {/* Email */}
        <label>
          {t('contacts.email')}

          <input
            type="email"
            {...register('email', {
              required: true,
            })}
          />

          {errors.email && (
            <span>{t('contacts.required')}</span>
          )}
        </label>

        {/* WhatsApp */}
        <label>
          {t('contacts.whatsapp')}

          <input
            type="text"
            {...register('whatsapp')}
          />
        </label>

        {/* Country */}
        <label>
          {t('contacts.country')}

          <input
            type="text"
            {...register('country')}
          />
        </label>

        {/* Category */}
        <label>
          {t('contacts.category')}

          <select {...register('category')}>
            <option value="">
              {t('contacts.selectCategory')}
            </option>

            <option value="1">Category 1</option>
            <option value="2">Category 2</option>
          </select>
        </label>

        {/* Message */}
        <label>
          {t('contacts.message')}

          <textarea
            {...register('message', {
              required: true,
            })}
          />

          {errors.message && (
            <span>{t('contacts.required')}</span>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {t('contacts.send')}
        </button>
      </form>
    </main>
  )
}