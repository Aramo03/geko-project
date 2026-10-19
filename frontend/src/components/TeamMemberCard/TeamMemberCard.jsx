import { useTranslation } from 'react-i18next'
import OptimizedImage from '../OptimizedMedia/OptimizedImage.jsx'
import { getTeamImage, getTeamTranslation } from './teamMember.js'
import './teamMember.css'

export default function TeamMemberCard({ member, riseDelayClass = '' }) {
  const { t } = useTranslation()
  const translation = getTeamTranslation(member.translations)
  const image = getTeamImage(member)

  return (
    <article
      className={`team-member-card about-hover-lift min-w-0 overflow-hidden rounded-[10px] border border-border bg-surface shadow-[0_5px_14px_rgb(22_45_34/4%)] animate-rise-in max-[480px]:grid max-[480px]:grid-cols-[104px_minmax(0,1fr)] ${riseDelayClass}`}
    >
      {image ? (
        <OptimizedImage
          className="team-member-card__image block h-[180px] w-full object-cover bg-brand-soft max-[480px]:min-h-[136px] max-[480px]:h-full"
          src={image}
          alt={translation?.name ? t('about.memberImageAlt', { name: translation.name }) : ''}
          width={320}
          height={360}
          sizes="(max-width: 480px) 104px, 25vw"
        />
      ) : (
        <div
          className="h-[180px] w-full bg-brand-soft max-[480px]:min-h-[136px] max-[480px]:h-full"
          aria-hidden="true"
        />
      )}
      <div className="overflow-wrap-anywhere p-3.5 max-[480px]:p-3">
        {translation?.name ? (
          <h3 className="m-0 text-[0.9rem] font-[750] leading-snug text-text">{translation.name}</h3>
        ) : null}
        {translation?.role ? (
          <p className="mt-1 inline-block rounded-[3px] bg-brand-soft px-1.5 py-0.5 text-[0.65rem] font-bold text-brand">
            {translation.role}
          </p>
        ) : null}
        {translation?.desc ? (
          <p className="mt-2 text-[0.74rem] leading-snug text-text-muted">{translation.desc}</p>
        ) : null}
      </div>
    </article>
  )
}
