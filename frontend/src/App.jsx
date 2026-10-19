import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import { UiBlocksProvider } from './lib/uiBlocks.jsx'

const Home = lazy(() => import('./pages/Home/Home.jsx'))
const About = lazy(() => import('./pages/About/About.jsx'))
const CourseCategory = lazy(() => import('./pages/CourseCategory/CourseCategory.jsx'))
const CourseDetails = lazy(() => import('./pages/CourseDetails/CourseDetails.jsx'))
const Events = lazy(() => import('./pages/Events/Events.jsx'))
const Contacts = lazy(() => import('./pages/Contacts/Contacts.jsx'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound.jsx'))

export default function App() {
  return (
    <UiBlocksProvider>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
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
