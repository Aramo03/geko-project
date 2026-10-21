import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import { UiBlocksProvider } from './lib/uiBlocks.jsx'

// Each route is its own chunk, so About/Courses/Events/Contacts
// are not downloaded with Home (wave 6 chunk budget).
const Home = lazy(() => import('./pages/Home/Home.jsx'))
const About = lazy(() => import('./pages/About/About.jsx'))
const CourseCategory = lazy(() => import('./pages/CourseCategory/CourseCategory.jsx'))
const CourseDetails = lazy(() => import('./pages/CourseDetails/CourseDetails.jsx'))
const Events = lazy(() => import('./pages/Events/Events.jsx'))
const Contacts = lazy(() => import('./pages/Contacts/Contacts.jsx'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound.jsx'))

// Per-route <title> keys (SEO base, wave 6 zone 10). The static fallback
// for crawlers / no-JS lives in index.html; Sv owns the final <html lang> pass.
function pageTitleKey(pathname) {
  if (pathname === '/') return 'pageTitles.home'
  if (pathname === '/about-us') return 'pageTitles.about'
  if (pathname === '/course-category') return 'pageTitles.categories'
  if (pathname.startsWith('/course-category/')) return 'pageTitles.category'
  if (pathname.startsWith('/courses/')) return 'pageTitles.course'
  if (pathname.startsWith('/events')) return 'pageTitles.events'
  if (pathname === '/contacts') return 'pageTitles.contacts'
  return 'pageTitles.notFound'
}

export default function App() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = t(pageTitleKey(pathname))
  }, [pathname, t, i18n.language])

  return (
    <UiBlocksProvider>
      <Header />
      <Suspense
        fallback={
          <p className="page-shell" role="status">
            {t('common.loading')}
          </p>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/course-category" element={<CourseCategory />} />
          <Route path="/course-category/:id" element={<CourseCategory />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:tab" element={<Events />} />
          <Route path="/events/:tab/:id" element={<Events />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </UiBlocksProvider>
  )
}
