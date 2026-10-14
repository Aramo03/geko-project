import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client'
import CommentList from '../../components/CommentList/CommentList.jsx'
import CommentForm from '../../components/CommentForm/CommentForm.jsx'
import {
  asList,
  categoryTitle,
  courseDescription,
  courseImage,
  courseLevel,
  courseStudents,
  courseTitle,
} from './courseCategory.js'
import './courseCategory.css'

export default function CourseCategoryDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [category, setCategory] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!id) return undefined

    setLoading(true)
    setError(false)
    setCategory(null)
    setCourses([])

    Promise.all([
      api.get(`/api/categories/${id}/`),
      api.get(`/api/courses/${id}/`, { params: { category: id } }),
    ])
      .then(([categoryRes, coursesRes]) => {
        if (cancelled) return
        const courseList = asList(coursesRes.data)
        if (!courseList) {
          setError(true)
          return
        }
        setCategory(categoryRes.data)
        setCourses(courseList)
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
  }, [id, i18n.language])

  const name = categoryTitle(category) || t('categories.popularTitle')

  return (
    <main className="min-h-screen bg-[#f7f9f8] py-16 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#0a5c36]">
            {t('categories.kicker')}
          </p>
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
            {name}
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-gray-500">
            {t('categories.subtitle')}
          </p>
        </div>

        {loading && (
          <p className="py-20 text-center text-gray-600">{t('common.loading')}</p>
        )}
        {error && (
          <p className="py-20 text-center text-red-500">{t('common.error')}</p>
        )}
        {!loading && !error && courses.length === 0 && (
          <p className="py-20 text-center text-gray-500">{t('common.empty')}</p>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const title = courseTitle(course) || t('categories.untitled')
              const image = courseImage(course)
              const description = courseDescription(course)
              const students = courseStudents(course)
              const level = courseLevel(course)
              const badge = categoryTitle(course.category) || name

              return (
                <article
                  key={course.id}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 h-48 overflow-hidden rounded-xl bg-gray-200">
                    {image ? (
                      <img src={image} alt={title} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <span className="mb-3 inline-block w-fit rounded-md bg-[#e8f3ee] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0a5c36]">
                    {badge}
                  </span>
                  <h2 className="mb-2 text-lg font-extrabold text-gray-900">{title}</h2>
                  {description ? (
                    <p className="mb-6 line-clamp-2 text-sm text-gray-500">{description}</p>
                  ) : null}
                  <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4">
                    <div className="flex flex-col gap-1.5 text-[11px] font-medium text-gray-500">
                      {students ? (
                        <div className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                          </svg>
                          <span>
                            {students} {t('categories.students')}
                          </span>
                        </div>
                      ) : null}
                      {level ? (
                        <div className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span>{level}</span>
                        </div>
                      ) : null}
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="rounded-lg bg-[#0a5c36] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#074628]"
                    >
                      {t('categories.learnMore')}
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mt-12 text-center">
              <Link
                to="/course-category"
                className="inline-block rounded-lg bg-[#0a5c36] px-8 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-[#074628]"
              >
                {t('categories.viewAll')}
              </Link>
            </div>

            <section className="mt-16 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <CommentList categoryId={id} />
              <CommentForm categoryId={id} />
            </section>
          </>
        )}
      </div>
    </main>
  )
}
