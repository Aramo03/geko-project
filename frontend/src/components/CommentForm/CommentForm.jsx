import { useForm } from 'react-hook-form'
import { api } from '../../api/client.js'
import './commentForm.css'

export default function CommentForm({
  category,
  popularCourse,
  onCreated,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm()

  async function onSubmit(data) {
    const payload = {
      full_name: data.full_name,
      email: data.email,
      whatsapp: data.whatsapp,
      text: data.text,
    }

    if (category) {
      payload.category = category
    }

    if (popularCourse) {
      payload.popular_course = popularCourse
    }

    try {
      await api.post(
        '/api/comments/',
        payload
      )

      reset()

      if (onCreated) {
        onCreated()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form
      className="comment-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        {...register('full_name', {
          required: true,
        })}
      />

      <input
        type="email"
        {...register('email', {
          required: true,
        })}
      />

      <input
        {...register('whatsapp')}
      />

      <textarea
        {...register('text', {
          required: true,
        })}
      />

      <button
        type="submit"
        disabled={isSubmitting}
      >
        Send
      </button>
    </form>
  )
}