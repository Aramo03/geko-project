import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { courseDescription, courseImage, courseTitle } from './courseCard.js'
import './courseCard.css'

export default function CourseCard({ course }) {
  const { t } = useTranslation()
  const title = courseTitle(course) || t('course.untitled')
  const description = courseDescription(course)
  const image = courseImage(course)

  return (
    <article className="course-card">
      <Link to={`/courses/${course.id}`} className="course-card__link">
        {image ? (
          <img className="course-card__image" src={image} alt={title} />
        ) : (
          <div className="course-card__image course-card__image--empty" aria-hidden="true" />
        )}
        <div className="course-card__body">
          <h3 className="course-card__title">{title}</h3>
          {description ? <p className="course-card__desc">{description}</p> : null}
          <span className="course-card__more">
            {t('course.learnMore')}
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  )
}
