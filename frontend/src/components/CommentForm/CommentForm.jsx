import { useForm } from 'react-hook-form'
import { api } from '../../api/client.js'

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
      await api.post('/api/comments/', payload)

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
      className="mx-auto flex w-full max-w-[380px] flex-col gap-5 rounded-[35px] bg-white px-5 pb-[60px] pt-[30px] shadow-[0_15px_35px_rgba(0,0,0,0.12)]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        type="text"
        placeholder="Your name"
        className="box-border h-[49px] w-full border border-[#888] bg-white px-5 py-3 text-[15px] text-[#333] outline-none placeholder:text-[#b8b8b8] focus:border-[#859c35]"
        {...register('full_name', {
          required: 'Name is required',
        })}
      />

      {errors.full_name && (
        <p className="-mt-4 text-xs text-red-500">
          {errors.full_name.message}
        </p>
      )}

      <input
        type="email"
        placeholder="Your email"
        className="box-border h-[49px] w-full border border-[#888] bg-white px-5 py-3 text-[15px] text-[#333] outline-none placeholder:text-[#b8b8b8] focus:border-[#859c35]"
        {...register('email', {
          required: 'Email is required',
        })}
      />

      {errors.email && (
        <p className="-mt-4 text-xs text-red-500">
          {errors.email.message}
        </p>
      )}

      <input
        type="text"
        placeholder="Your WhatsApp"
        className="box-border h-[49px] w-full border border-[#888] bg-white px-5 py-3 text-[15px] text-[#333] outline-none placeholder:text-[#b8b8b8] focus:border-[#859c35]"
        {...register('whatsapp')}
      />

      <textarea
        placeholder="Your message..."
        className="box-border h-32 w-full resize-none border border-[#888] bg-white px-5 py-3 text-[15px] text-[#333] outline-none placeholder:text-[#b8b8b8] focus:border-[#859c35]"
        {...register('text', {
          required: 'Message is required',
        })}
      />

      {errors.text && (
        <p className="-mt-4 text-xs text-red-500">
          {errors.text.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full cursor-pointer border-0 bg-[#859c35] text-[13px] font-medium uppercase text-white transition-colors duration-300 hover:bg-[#71852d] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'SENDING...' : 'SEND'}
      </button>
    </form>
  )
}
