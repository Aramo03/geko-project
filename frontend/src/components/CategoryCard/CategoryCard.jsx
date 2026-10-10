import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { categoryImage, categoryLabel } from './categoryCard.js'
import './categoryCard.css'

export default function CategoryCard({ category }) {
  const { t } = useTranslation()
  const label = categoryLabel(category) || t('categories.untitled')
  const image = categoryImage(category)

  return (
    <Link to={`/course-category/${category.id}`} className="category-card">
      {image ? <img src={image} alt={label} /> : null}
      <span>{label}</span>
    </Link>
  )
}
