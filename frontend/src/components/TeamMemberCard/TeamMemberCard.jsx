import { useTranslation } from 'react-i18next'
import { getTeamImage, getTeamTranslation } from './teamMember.js'
import './teamMember.css'

export default function TeamMemberCard({ member }) {
  const { t } = useTranslation()
  const translation = getTeamTranslation(member.translations)
  const image = getTeamImage(member)

  return (
    <article className="team-member-card">
      {image && (
        <img
          className="team-member-card__image"
          src={image}
          alt={translation?.name ? t('about.memberImageAlt', { name: translation.name }) : ''}
          loading="lazy"
        />
      )}
      <div className="team-member-card__content">
        {translation?.name && <h3>{translation.name}</h3>}
        {translation?.role && <p className="team-member-card__role">{translation.role}</p>}
        {translation?.desc && <p>{translation.desc}</p>}
      </div>
    </article>
  )
}
