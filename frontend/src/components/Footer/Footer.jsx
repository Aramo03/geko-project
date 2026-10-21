import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from 'react-icons/fa'
import { useUiBlocks } from '../../lib/uiBlocks.jsx'
import { FOOTER_LEGAL_LINKS, NAV_ITEMS } from './footer.js'
import './footer.css'

const SOCIAL_ICONS = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
}

export default function Footer() {
  const { t } = useTranslation()
  const { channels, socials } = useUiBlocks()

  const { phone, email, map, logo } = channels
  const addressLine = t('contacts.addressLine')

  // An API social without a known icon must not crash the shell.
  const socialLinks = socials
    .map((item) => ({
      ...item,
      Icon: SOCIAL_ICONS[item.name],
    }))
    .filter((item) => item.Icon)

  return (
    <footer className="footer-shell w-full bg-brand font-sans text-white">
      <div className="mx-auto max-w-[var(--container-page)] px-6 pb-5 pt-[60px] sm:px-10 lg:px-[5.5%]">
        <div className="grid grid-cols-1 gap-12 pb-[55px] md:grid-cols-3 md:gap-16">
          <div>
            <Link to="/" className="mb-7 inline-flex items-center gap-3">
              <img
                className="h-[60px] w-[60px] object-contain"
                src={logo}
                alt={t('header.logoAlt')}
              />
            </Link>

            <h3 className="mb-5 text-[13px] font-bold text-white">{t('nav.about')}</h3>

            <p className="max-w-[280px] text-[12px] leading-[1.8] text-white/65">
              {t('footer.description')}
            </p>

            {socialLinks.length > 0 ? (
              <div className="mt-5 flex items-center gap-4">
                {socialLinks.map(({ name, url, Icon }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="transition hover:text-accent"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="md:pl-8">
            <h3 className="mb-5 text-[13px] font-bold text-white">{t('footer.quickLinks')}</h3>

            <div className="flex flex-col gap-[14px]">
              {NAV_ITEMS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="w-fit text-[12px] text-white/65 transition-colors hover:text-white"
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-[13px] font-bold text-white">{t('footer.contactInfo')}</h3>

            <div className="flex flex-col gap-5">
              {addressLine ? (
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt size={16} className="mt-[2px] shrink-0 text-white" />
                  <p className="max-w-[260px] text-[12px] leading-[1.7] text-white/65">
                    {addressLine}
                  </p>
                </div>
              ) : null}

              {phone ? (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  className="flex items-center gap-3 text-[12px] text-white/65 transition-colors hover:text-white"
                >
                  <FaPhoneAlt size={16} className="shrink-0 text-white" />
                  <span>{phone}</span>
                </a>
              ) : null}

              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-[12px] text-white/65 transition-colors hover:text-white"
                >
                  <FaEnvelope size={16} className="shrink-0 text-white" />
                  <span>{email}</span>
                </a>
              ) : null}

              {map ? (
                <a
                  href={map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-white/65 transition-colors hover:text-white"
                >
                  {t('footer.map')}
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 pb-1 pt-[45px] sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[300px] text-[11px] leading-[1.5] text-white/45">
            {t('footer.copyright')}
          </p>

          <div className="flex items-center gap-6">
            <a
              href={FOOTER_LEGAL_LINKS.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-white/45 transition-colors hover:text-white"
            >
              {t('footer.privacyPolicy')}
            </a>

            <a
              href={FOOTER_LEGAL_LINKS.terms}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-white/45 transition-colors hover:text-white"
            >
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
