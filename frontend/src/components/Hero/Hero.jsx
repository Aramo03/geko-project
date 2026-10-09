import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import './hero.css'

export default function Hero() {
  const [hero, setHero] = useState(null)

  useEffect(() => {
    async function loadHero() {
      try {
        const response = await api.get('/api/ui-blocks/')

        const heroBlock = (response.data || []).find(
          (block) => block.key === 'hero' && block.is_visible
        )

        setHero(heroBlock || null)
      } catch (error) {
        console.error('Failed to load hero:', error)
        setHero(null)
      }
    }

    loadHero()
  }, [])

  const payload = hero?.payload || {}

  if (!hero) {
    return null
  }

  return (
    <section className="hero">
      <div className="hero__content">
        {payload.title && (
          <h1 className="hero__title">{payload.title}</h1>
        )}

        {payload.subtitle && (
          <p className="hero__subtitle">{payload.subtitle}</p>
        )}

        {payload.text && (
          <p className="hero__text">{payload.text}</p>
        )}

        {payload.button_text && payload.button_url && (
          <a
            href={payload.button_url}
            className="hero__button"
          >
            {payload.button_text}
          </a>
        )}
      </div>

      {payload.image && (
        <div className="hero__image-wrapper">
          <img
            src={payload.image}
            alt={payload.title || 'Hero'}
            className="hero__image"
          />
        </div>
      )}
    </section>
  )
}