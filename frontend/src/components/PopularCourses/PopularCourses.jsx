import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import {
  asCourseList,
  courseCategoryLabel,
  courseDescription,
  courseImage,
  courseSlug,
  courseTitle,
} from './popularCourses.js'
import './popularCourses.css'

export default function PopularCourses() {
  const { t, i18n } = useTranslation()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setCourses([])

    api
      .get('/api/popular_courses/')
      .then((res) => {
        if (cancelled) return
        const list = asCourseList(res.data)
        if (!list) {
          setError(true)
          return
        }
        setCourses(list)
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
    <section className="popular-courses home-shell" aria-labelledby="popular-courses-title">
      <p className="home-section-kicker home-section-kicker--center">
        {t('home.popularCourses.kicker')}
      </p>
      <h2 id="popular-courses-title" className="home-section-title home-section-title--center">
        {t('home.popularCourses.title')}
      </h2>
      <p className="popular-courses__lead">{t('home.popularCourses.lead')}</p>

      {loading && <p className="popular-courses__state">{t('common.loading')}</p>}
      {error && <p className="popular-courses__state popular-courses__state--error">{t('common.error')}</p>}
      {!loading && !error && courses.length === 0 && (
        <p className="popular-courses__state">{t('common.empty')}</p>
      )}

      {!loading && !error && courses.length > 0 && (
        <ul className="popular-courses__grid">
          {courses.map((course) => {
            const title = courseTitle(course) || t('home.untitled')
            const slug = courseSlug(title)
            const metaKey = `home.popularCourses.meta.${slug}`
            const students = t(`${metaKey}.students`, { defaultValue: '' })
            const level = t(`${metaKey}.level`, { defaultValue: '' })
            const image = courseImage(course)
            const category = courseCategoryLabel(course)

            return (
              <li key={course.id} className="popular-courses__card ui-rise-in about-hover-lift-sm">
                <div className="popular-courses__media">
                  {image ? (
                    <img src={image} alt="" />
                  ) : (
                    <div className="popular-courses__media-fallback" aria-hidden="true" />
                  )}
                </div>
                <div className="popular-courses__body">
                  {category ? (
                    <p className="popular-courses__category">{category}</p>
                  ) : null}
                  <h3 className="popular-courses__name">{title}</h3>
                  <p className="popular-courses__desc">{courseDescription(course)}</p>
                  <div className="popular-courses__footer">
                    <div className="popular-courses__meta">
                      {students ? <span>{students}</span> : null}
                      {level ? <span>{level}</span> : null}
                    </div>
                    <Link className="popular-courses__link" to={`/courses/${course.id}`}>
                      {t('home.popularCourses.learnMore')}
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className="popular-courses__cta-wrap">
        <Link className="popular-courses__cta" to="/course-category">
          {t('home.popularCourses.viewAll')}
        </Link>
      </div>
    </section>
  )
}
