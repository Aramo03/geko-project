
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn
} from "react-icons/fa";
import { api } from "../../api/client.js";
import { NAV_ITEMS, LANGUAGES } from "./header.js";

export default function Header() {
  const { t, i18n } = useTranslation();

  const [blocks, setBlocks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const flags = {
    am: "/images/flags/Armenia-flag.webp",
    en: "/images/flags/USA-flag.webp",
    ru: "/images/flags/Russia-flag.webp"
  };

  const currentLanguage = i18n.language.split("-")[0];


  useEffect(() => {
    let active = true;

    api
      .get("/api/ui-blocks/")
      .then((res) => {
        if (!active) return;

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.results || [];

        setBlocks(data);
      })
      .catch(() => {
        if (active) setBlocks([]);
      });
      
    return () => {
      active = false;
    };
  }, [i18n.language]);

  const contactBlock = blocks.find(
    (item) => item.key === "contacts_bar" && item.is_visible !== false
  );

  const headerBlock = blocks.find(
    (item) => item.key === "header" && item.is_visible !== false
  );

  const contactData = contactBlock?.payload || {};
  const headerData = headerBlock?.payload || {};

  const phone = contactData.phone || headerData.phone || "";
  const email = contactData.email || headerData.email || "";
  const logo =
    typeof headerData.logo === "string" && headerData.logo.trim()
      ? headerData.logo.trim()
      : "/images/logo.webp";
  const buttonLink =
    typeof headerData.button_link === "string" && headerData.button_link.trim()
      ? headerData.button_link.trim()
      : "/contacts";

  const facebook = headerData.facebook || contactData.facebook || "";
  const instagram = headerData.instagram || contactData.instagram || "";
  const linkedin = headerData.linkedin || contactData.linkedin || "";

  const socialLinks = [
    { name: "Facebook", url: facebook, Icon: FaFacebookF },
    { name: "Instagram", url: instagram, Icon: FaInstagram },
    { name: "LinkedIn", url: linkedin, Icon: FaLinkedinIn }
  ];

  return (
    <header className="w-full bg-white font-sans">
      <div className="bg-[#0B3928] text-white">
        <div className="mx-auto flex min-h-[34px] max-w-[1440px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 text-[11px] sm:px-8 lg:px-[5.5%]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-2 transition hover:text-emerald-300"
              >
                <FaPhoneAlt
                  size={12}
                  className="shrink-0 text-emerald-400"
                />
                <span>{phone}</span>
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 transition hover:text-emerald-300"
              >
                <FaEnvelope
                  size={13}
                  className="shrink-0 text-emerald-400"
                />
                <span>{email}</span>
              </a>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:inline">
              {t("header.followUs")}
            </span>

            <div className="hidden items-center gap-3 sm:flex">
              {socialLinks.map(({ name, url, Icon }) =>
                url ? (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="flex items-center justify-center transition hover:text-emerald-300"
                  >
                    <Icon size={13} />
                  </a>
                ) : (
                  <span
                    key={name}
                    title={name}
                    className="flex items-center justify-center text-white/80"
                  >
                    <Icon size={13} />
                  </span>
                )
              )}
            </div>

            <span className="mx-1 h-3 w-px bg-white/25" />

            
<div className="relative">
  <button
    type="button"
    onClick={() => setLanguageOpen(!languageOpen)}
    aria-label={t("header.selectLanguage")}
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
        languageOpen ? "rotate-180" : ""
      }`}
    />
  </button>

  {languageOpen && (
    <div className="absolute right-0 top-full z-50 mt-2 flex min-w-[65px] flex-col gap-1 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => {
            i18n.changeLanguage(lang.code);
            setLanguageOpen(false);
          }}
          aria-label={lang.code}
          className={`flex items-center justify-center rounded-md p-2 transition hover:bg-gray-100 ${
            currentLanguage === lang.code ? "bg-gray-100" : ""
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
  )}
</div>

          </div>
        </div>
      </div>

      <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between gap-5 px-4 sm:px-8 lg:px-[5.5%]">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
        >
          <span >
            <img
              src={logo}
              alt={t("header.logoAlt")}
              className="h-[60px] w-[60px] object-cover"
            />
          </span>

        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `text-[12px] transition-colors hover:text-[#104A48] ${
                  isActive
                    ? "font-bold text-[#104A48]"
                    : "font-medium text-[#657084]"
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
            className="rounded-[6px] border border-[#104A48] px-4 py-[9px] text-[11px] font-semibold text-[#104A48] transition hover:bg-[#EAF3F0]"
          >
            {t("header.enrollNow")}
          </Link>

          
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t("header.toggleMenu")}
          aria-expanded={menuOpen}
          className="ml-auto text-[#104A48] lg:hidden"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-gray-100 bg-white px-5 py-3 lg:hidden">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-[#104A48] hover:bg-gray-100"
            >
              {t(item.key)}
            </NavLink>
          ))}

          <Link
            to={buttonLink}
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-md border border-[#104A48] px-3 py-2 text-center text-sm font-medium text-[#104A48]"
          >
            {t("header.enrollNow")}
          </Link>
        </nav>
      )}
    </header>
  );
}
