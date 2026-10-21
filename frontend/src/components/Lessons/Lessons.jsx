import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import OptimizedImage from '../OptimizedMedia/OptimizedImage.jsx'
import {
  asList,
  lessonTitle,
  lessonContent,
  lessonImage,
} from './lessons.js'
import './lessons.css'

export default function Lessons({
  lessons: suppliedLessons,
  loading: suppliedLoading,
  error: suppliedError,
  lessonTitle: getLessonTitle = lessonTitle,
  lessonContent: getLessonContent = lessonContent,
} = {}) {
  const { t, i18n } = useTranslation()
  const [fetchedLessons, setFetchedLessons] = useState([])
  const [fetchedLoading, setFetchedLoading] = useState(true)
  const [fetchedError, setFetchedError] = useState(false)
  const controlled = suppliedLessons !== undefined
  const lessons = controlled ? suppliedLessons : fetchedLessons
  const loading = controlled ? suppliedLoading : fetchedLoading
  const error = controlled ? suppliedError : fetchedError

  useEffect(() => {
    if (controlled) return undefined
    let cancelled = false

    setFetchedLoading(true)
    setFetchedError(false)
    setFetchedLessons([])

    api
      .get('/api/lesson_info/')
      .then((res) => {
        if (cancelled) return

        const list = asList(res.data)

        if (!list) {
          setFetchedError(true)
          return
        }

        setFetchedLessons(list)
      })
      .catch(() => {
        if (!cancelled) setFetchedError(true)
      })
      .finally(() => {
        if (!cancelled) setFetchedLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [controlled, i18n.language])

  return (
    <section className="home-lessons" aria-labelledby="home-lessons-title">
      <h2 id="home-lessons-title">{t('home.lessons')}</h2>

      {loading && <p role="status">{t('common.loading')}</p>}

      {error && <p className="error" role="alert">{t('common.error')}</p>}

      {!loading && !error && lessons.length === 0 && (
        <p>{t('common.empty')}</p>
      )}

      {!loading && !error && lessons.length > 0 && (
        <div className="home-lessons__list">
          {lessons.map((lesson) => {
            const title = getLessonTitle(lesson) || t('home.untitled')
            const content = getLessonContent(lesson)
            const image = lessonImage(lesson)

            return (
              <article
                className="home-lessons__card"
                key={lesson.id}
              >
                {image ? (
                  <OptimizedImage
                    src={image}
                    alt={t('home.lessonImageAlt', { title })}
                    className="home-lessons__image"
                    sizes="(max-width: 700px) 100vw, 40vw"
                  />
                ) : null}
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
