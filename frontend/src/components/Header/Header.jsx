import { useState } from 'react'
import { Link, NavLink, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Menu, X } from 'lucide-react'
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa'
import { useUiBlocks } from '../../lib/uiBlocks.jsx'
import { NAV_ITEMS, LANGUAGES } from './header.js'
import './header.css'

export default function Header() {
  const { t, i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { channels, socials } = useUiBlocks()

  const [menuOpen, setMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)

  const flags = {
    am: '/images/flags/Armenia-flag.webp',
    en: '/images/flags/USA-flag.webp',
    ru: '/images/flags/Russia-flag.webp',
  }

  const currentLanguage = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]
  const { phone, email, logo, buttonLink } = channels

  const socialIcons = {
    Facebook: FaFacebookF,
    Instagram: FaInstagram,
    LinkedIn: FaLinkedinIn,
  }

  const socialLinks = socials.map((item) => ({
    ...item,
    Icon: socialIcons[item.name],
  }))

  return (
    <header className="header-shell w-full bg-white font-sans">
      <div className="bg-brand text-white">
        <div className="mx-auto flex min-h-[34px] max-w-[var(--container-page)] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 text-[11px] sm:px-8 lg:px-[5.5%]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {phone ? (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="flex items-center gap-2 transition hover:text-accent"
              >
                <FaPhoneAlt size={12} className="shrink-0 text-accent" />
                <span>{phone}</span>
              </a>
            ) : null}

            {email ? (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 transition hover:text-accent"
              >
                <FaEnvelope size={13} className="shrink-0 text-accent" />
                <span>{email}</span>
              </a>
            ) : null}
          </div>

          <div className="ml-auto flex items-center gap-3">
            {socialLinks.length > 0 ? (
              <>
                <span className="hidden sm:inline">{t('header.followUs')}</span>

                <div className="hidden items-center gap-3 sm:flex">
                  {socialLinks.map(({ name, url, Icon }) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="flex items-center justify-center transition hover:text-accent"
                    >
                      <Icon size={13} />
                    </a>
                  ))}
                </div>
              </>
            ) : null}

            <span className="mx-1 h-3 w-px bg-white/25" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setLanguageOpen(!languageOpen)}
                aria-label={t('header.selectLanguage')}
                aria-expanded={languageOpen}
                className="flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-white/10"
              >
                <img
                  src={flags[currentLanguage] || flags.en}
                  alt={currentLanguage}
                  className="h-[16px] w-[24px] rounded-[2px] object-cover"
                />

                <ChevronDown
                  size={12}
                  className={`text-white transition-transform ${
                    languageOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {languageOpen ? (
                <div className="absolute right-0 top-full z-50 mt-2 flex min-w-[65px] flex-col gap-1 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
  i18n.changeLanguage(lang.code)

  const params = new URLSearchParams(searchParams)
  params.set('language', lang.code)
  setSearchParams(params)

  setLanguageOpen(false)
}}
                      aria-label={lang.code}
                      className={`flex items-center justify-center rounded-md p-2 transition hover:bg-gray-100 ${
                        currentLanguage === lang.code ? 'bg-gray-100' : ''
                      }`}
                    >
                      <img
                        src={flags[lang.code]}
                        alt={lang.code}
                        className="h-[18px] w-[28px] rounded-[2px] object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-[64px] max-w-[var(--container-page)] items-center justify-between gap-5 px-4 sm:px-8 lg:px-[5.5%]">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src={logo}
            alt={t('header.logoAlt')}
            className="h-[60px] w-[60px] object-cover"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-[12px] transition-colors hover:text-brand-ink ${
                  isActive
                    ? 'font-bold text-brand-ink'
                    : 'font-medium text-brand-muted'
                }`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to={buttonLink}
            className="rounded-[6px] border border-brand-ink px-4 py-[9px] text-[11px] font-semibold text-brand-ink transition hover:bg-brand-soft"
          >
            {t('header.enrollNow')}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t('header.toggleMenu')}
          aria-expanded={menuOpen}
          className="ml-auto text-brand-ink lg:hidden"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {menuOpen ? (
        <nav className="flex flex-col gap-1 border-t border-gray-100 bg-white px-5 py-3 lg:hidden">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-brand-ink hover:bg-brand-soft"
            >
              {t(item.key)}
            </NavLink>
          ))}

          <Link
            to={buttonLink}
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-md border border-brand-ink px-3 py-2 text-center text-sm font-medium text-brand-ink"
          >
            {t('header.enrollNow')}
          </Link>
        </nav>
      ) : null}
    </header>
  )
}
