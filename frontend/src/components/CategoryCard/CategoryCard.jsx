import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OptimizedImage from '../OptimizedMedia/OptimizedImage.jsx'
import { categoryImage, categoryLabel } from './categoryCard.js'

export default function CategoryCard({ category, className = '' }) {
  const { t } = useTranslation()
  const label = categoryLabel(category) || t('categories.untitled')
  const image = categoryImage(category)
  const metaKey = `categories.meta.${category.id}`
  const tag = t(`${metaKey}.tag`, { defaultValue: t('categories.tagDefault') })
  const description = t(`${metaKey}.description`, { defaultValue: '' })
  const students = t(`${metaKey}.students`, { defaultValue: t('categories.studentsFallback') })

  return (
    <article
      className={`about-hover-lift ui-rise-in flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-4 shadow-[0_1px_3px_rgb(22_45_34/6%)] ${className}`}
    >
      <div>
        <div className="mb-4 h-48 w-full overflow-hidden rounded-xl bg-surface-soft">
          {image ? (
            <OptimizedImage
              src={image}
              alt={label}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : null}
        </div>
        <span className="mb-3 inline-block rounded-md bg-brand-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand">
          {tag}
        </span>
        <h2 className="mb-2 text-lg font-extrabold text-text">{label}</h2>
        <p className="mb-6 line-clamp-2 text-xs text-text-muted">
          {description || label}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-copy-muted">{students}</span>
        <Link
          to={`/course-category/${category.id}`}
          className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white no-underline transition-colors hover:bg-brand-dark"
        >
          {t('categories.learnMore')}
        </Link>
      </div>
    </article>
  )
}
