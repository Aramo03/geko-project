import { Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import { UiBlocksProvider } from './lib/uiBlocks.jsx'
import Home from './pages/Home/Home.jsx'
import About from './pages/About/About.jsx'
import CourseCategory from './pages/CourseCategory/CourseCategory.jsx'
import CourseDetails from './pages/CourseDetails/CourseDetails.jsx'
import Events from './pages/Events/Events.jsx'
import Contacts from './pages/Contacts/Contacts.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'


export default function App() {
  const { i18n } = useTranslation()

useEffect(() => {
  document.documentElement.lang = i18n.language.split('-')[0]
}, [i18n.language])
  return (
    <UiBlocksProvider>
      <Header />
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
      <Footer />
    </UiBlocksProvider>
  )
}
