import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client'
import './courseCategory.css'

export default function CourseCategoryList() {
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/categories/')
      .then((res) => {
        const data = res.data.results || res.data || []
        setCategories(data)
      })
      .catch((err) => {
        console.error("API error, using fallback:", err)
        // Եթե բեքենդը չկա, ցույց ենք տալիս Ֆիգմայի նկարի 6 քարտերը
        setCategories([
          { id: 1, title: 'English Language', tag: 'LANGUAGE ARTS', description: 'Master creative verbal clarity, public speech models, and structured international reading levels.', students_count: '148 Students', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80' },
          { id: 2, title: 'Programming', tag: 'COMPUTER SCIENCE', description: 'Learn algorithmic logic, Python essentials, game loops, and systematic program architectures.', students_count: '310 Students', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80' },
          { id: 3, title: 'Mathematics', tag: 'EXACT SCIENCES', description: 'Advance logical geometry, problem-solving speeds, and analytical thinking frameworks.', students_count: '109 Students', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80' },
          { id: 4, title: 'Robotics', tag: 'APPLIED TECH', description: 'Build real microcontrollers, wiring sensory-relays, and assembling custom automation hardware.', students_count: '154 Students', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80' },
          { id: 5, title: 'Graphic Design', tag: 'DIGITAL ART', description: 'Explore interface spatial grid systems, master illustration pulses, and typographic brand styles.', students_count: '192 Students', image: 'https://images.unsplash.com/photo-1542744094-3a31246263d0?auto=format&fit=crop&w=600&q=80' },
          { id: 6, title: 'Digital Skills', tag: 'CORE COMPETENCE', description: 'Navigate virtual cloud networks, safely advanced keyboard-efficiency, and data synthesis.', students_count: '184 Students', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80' }
        ])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [i18n.language])

  return (
    <main className="min-h-screen bg-[#f7f9f8] py-16 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0a5c36]">
            EMPOWERMENT CURRICULUM
          </p>
          <h1 className="mb-3 text-4xl font-extrabold text-gray-900 tracking-tight">
            Popular Courses
          </h1>
          <p className="mx-auto max-w-xl text-sm text-gray-500">
            Explore our most popular educational programs customized for logical, analytical, and digital maturity.
          </p>
        </div>

        {loading ? (
          <p className="py-20 text-center text-gray-600">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, idx) => (
              <div
                key={cat.id || idx}
                className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="mb-4 h-48 w-full overflow-hidden rounded-xl bg-gray-100">
                    <img 
                      src={cat.image || cat.image_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80'} 
                      alt={cat.title} 
                      className="h-full w-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="mb-3 inline-block rounded-md bg-[#e8f3ee] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0a5c36]">
                    {cat.tag || 'COURSE CATEGORY'}
                  </span>
                  <h2 className="mb-2 text-lg font-extrabold text-gray-900">{cat.title}</h2>
                  <p className="mb-6 text-xs text-gray-500 line-clamp-2">{cat.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>👥 {cat.students_count || '100+ Students'}</span>
                  </div>
                  <Link
                    to={`/course-category/${cat.id || 1}`}
                    className="rounded-lg bg-[#0a5c36] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#074729]"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}