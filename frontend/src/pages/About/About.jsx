import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api, pickTranslation } from '../../api/client.js'
import './about.css'

export default function About() {
  const { t } = useTranslation()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    api
      .get('/api/teams/')
      .then((res) => setTeams(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="page about-page">
      <h1>{t('nav.about')}</h1>
      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.error')}</p>}
      {!loading && !error && teams.length === 0 && <p>{t('common.empty')}</p>}
      <ul>
        {teams.map((member) => {
          const tr = pickTranslation(member.translations)
          return (
            <li key={member.id}>
              <strong>{tr?.name}</strong> — {tr?.role}
              {tr?.desc && <p>{tr.desc}</p>}
            </li>
          )
        })}
      </ul>
    </main>
  )
}
