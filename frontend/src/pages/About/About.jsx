import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client.js'
import TeamMemberCard from '../../components/TeamMemberCard/TeamMemberCard.jsx'
import './about.css'

export default function About() {
  const { t, i18n } = useTranslation()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    api
      .get('/api/teams/')
      .then((res) => {
        if (active) setTeams(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [i18n.language])

  return (
    <main className="page about-page">
      <h1>{t('nav.about')}</h1>
      <section className="about-team" aria-labelledby="about-team-title">
        <h2 id="about-team-title">{t('about.team')}</h2>
        {loading && <p>{t('common.loading')}</p>}
        {error && <p className="error" role="alert">{t('common.error')}</p>}
        {!loading && !error && teams.length === 0 && <p>{t('common.empty')}</p>}
        {!loading && !error && teams.length > 0 && (
          <div className="about-team-grid">
            {teams.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
