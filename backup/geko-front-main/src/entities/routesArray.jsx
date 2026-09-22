import Contacts from '../components/pages/contacts/Contacts'
import Courses from '../components/pages/courses/Courses'
import AboutUs from '../components/pages/about/AboutUs'
import Events from '../components/pages/events/Events'
import Home from '../components/pages/home/Home'

export const routesArray = [
  {
    id: 1,
    name: 'HOME',
    component: Home,
    path: '/',
  },
  {
    id: 2,
    name: 'ABOUT_US',
    component: AboutUs,
    path: '/about-us',
  },
  {
    id: 5,
    name: 'COURSES',
    component: Courses,
    path: '/course-category',
  },
  {
    id: 4,
    name: 'EVENTS',
    component: Events,
    path: '/events',
  },
  {
    id: 6,
    name: 'CONTACTS',
    component: Contacts,
    path: '/contacts',
  },
];
