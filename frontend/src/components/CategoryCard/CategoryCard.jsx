import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OptimizedImage from '../OptimizedMedia/OptimizedImage.jsx'
import { categoryImage, categoryLabel } from './categoryCard.js'

export default function CategoryCard({ category }) {
  const { t } = useTranslation()
  const label = categoryLabel(category) || t('categories.untitled')
  const image = categoryImage(category)

  return (
    <Link
      to={`/course-category/${category.id}`}
      className="about-hover-lift flex flex-col gap-3 border border-border bg-surface p-3 text-inherit no-underline animate-rise-in"
    >
      {image ? (
        <OptimizedImage
          src={image}
          alt={label}
          className="h-40 w-full object-cover"
          sizes="(max-width: 768px) 100vw, 320px"
        />
      ) : null}
      <span className="font-semibold text-brand">{label}</span>
    </Link>
  )
}
