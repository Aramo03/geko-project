import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import {
  asList,
  lessonTitle,
  lessonContent,
} from './lessons.js'
import './lessons.css'

export default function Lessons() {
  const { t, i18n } = useTranslation()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(false)
    setLessons([])

    api
      .get('/api/lesson_info/')
      .then((res) => {
        if (cancelled) return

        const list = asList(res.data)

        if (!list) {
          setError(true)
          return
        }

        setLessons(list)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [i18n.language])

  return (
    <section className="home-lessons">
      <h2>{t('home.lessons')}</h2>

      {loading && <p>{t('common.loading')}</p>}

      {error && <p className="error">{t('common.error')}</p>}

      {!loading && !error && lessons.length === 0 && (
        <p>{t('common.empty')}</p>
      )}

      {!loading && !error && lessons.length > 0 && (
        <div className="home-lessons__list">
          {lessons.map((lesson) => {
            const title = lessonTitle(lesson) || t('home.untitled')
            const content = lessonContent(lesson)

            return (
              <article
                className="home-lessons__card"
                key={lesson.id}
              >
                <h3>{title}</h3>

                {content && (
                  <p className="home-lessons__content">{content}</p>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
