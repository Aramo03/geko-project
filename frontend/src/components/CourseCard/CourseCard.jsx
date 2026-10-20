import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OptimizedImage from '../OptimizedMedia/OptimizedImage.jsx'
import { courseCategoryLabel, courseDescription, courseImage, courseMark, courseTitle } from './courseCard.js'
import './courseCard.css'

export default function CourseCard({ course, className = '' }) {
  const { t } = useTranslation()
  const title = courseTitle(course) || t('course.untitled')
  const description = courseDescription(course)
  const category = courseCategoryLabel(course)
  const image = courseImage(course)

  return (
    <article className={`course-card ${className}`}>
      <Link to={`/courses/${course.id}`} className="course-card__link">
        <div className="course-card__media">
          {image ? (
            <OptimizedImage
              src={image}
              alt={title}
              className="course-card__image animate-media-in"
              sizes="(max-width: 768px) 100vw, 380px"
            />
          ) : (
            <div className="course-card__image course-card__image--empty" aria-hidden="true">
              <span className="course-card__mark">{courseMark(title)}</span>
            </div>
          )}
        </div>
        <div className="course-card__body">
          {category ? <p className="course-card__category">{category}</p> : null}
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
