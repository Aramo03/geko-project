import './notfound.css'

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__content">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you are looking for does not exist.</p>
        <a href="/">Go to Home</a>
      </div>
    </main>
  )
}