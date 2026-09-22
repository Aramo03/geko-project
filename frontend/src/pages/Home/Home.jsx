import { HOME_SECTIONS } from './home.js'
import './home.css'

export default function Home() {
  return (
    <main className="page">
      <p>TODO Home sections: {HOME_SECTIONS.join(' → ')}</p>
    </main>
  )
}
