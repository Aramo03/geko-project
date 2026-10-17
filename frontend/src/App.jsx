import { Route, Routes } from "react-router-dom"
import Header from "./components/Header/Header.jsx"
import Footer from "./components/Footer/Footer.jsx"
import { UiBlocksProvider } from "./lib/uiBlocks.jsx"
import Home from "./pages/Home/Home.jsx"
import About from "./pages/About/About.jsx"
import CourseCategoryList from "./pages/CourseCategory/CourseCategoryList.jsx"
import CourseCategoryDetail from "./pages/CourseCategory/CourseCategoryDetail.jsx"
import CourseDetails from "./pages/CourseDetails/CourseDetails.jsx"
import Events from "./pages/Events/Events.jsx"
import Contacts from "./pages/Contacts/Contacts.jsx"
import NotFound from "./pages/NotFound/NotFound.jsx"

export default function App() {
  return (
    <UiBlocksProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/course-category" element={<CourseCategoryList />} />
        <Route path="/course-category/:id" element={<CourseCategoryDetail />} />
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