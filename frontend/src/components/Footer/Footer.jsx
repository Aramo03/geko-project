
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { api } from "../../api/client.js";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const [blocks, setBlocks] = useState([]);

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

  const footerBlock = blocks.find(
    (item) => item.key === "footer" && item.is_visible !== false
  );

  const contactBlock = blocks.find(
    (item) => item.key === "contacts_bar" && item.is_visible !== false
  );

  const headerBlock = blocks.find(
    (item) => item.key === "header" && item.is_visible !== false
  );

  const footerData = footerBlock?.payload || {};
  const contactData = contactBlock?.payload || {};
  const headerData = headerBlock?.payload || {};

 const currentLanguage = i18n.language.split("-")[0];

const getLocalizedValue = (value) => {
  if (typeof value === "string") return value;

  if (value && typeof value === "object") {
    return (
      value[currentLanguage] ||
      value.en ||
      value.am ||
      value.ru ||
      ""
    );
  }

  return "";
};

const phone = getLocalizedValue(
  footerData.phone || contactData.phone
);

const email = getLocalizedValue(
  footerData.email || contactData.email
);

const address = getLocalizedValue(
  footerData.address || contactData.address
);

const map = getLocalizedValue(footerData.map);

const description = getLocalizedValue(footerData.description);

const logo =
  typeof headerData.logo === "string" && headerData.logo.trim()
    ? headerData.logo.trim()
    : "/images/logo.webp";

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/about-us", label: t("nav.about") },
    { to: "/course-category", label: t("nav.courses") },
    { to: "/events", label: t("nav.events") },
    { to: "/contacts", label: t("nav.contacts") }
  ];

  return (
    <footer className="w-full bg-[#0B3928] font-sans text-white">
      <div className="mx-auto max-w-[1440px] px-6 pb-5 pt-[60px] sm:px-10 lg:px-[5.5%]">
        <div className="grid grid-cols-1 gap-12 pb-[55px] md:grid-cols-3 md:gap-16">
          <div>
            <Link
              to="/"
              className="mb-7 inline-flex items-center gap-3"
            >
                <img className="h-[60px] w-[60px] object-contain" src={logo} alt={t("header.logoAlt")} />

            </Link>

            <h3 className="mb-5 text-[13px] font-bold text-white">
              {t("nav.about")}
            </h3>

            <p className="max-w-[280px] text-[12px] leading-[1.8] text-white/65">
              {description || t("footer.description")}
            </p>
          </div>

          <div className="md:pl-8">
            <h3 className="mb-5 text-[13px] font-bold text-white">
              {t("footer.quickLinks")}
            </h3>

            <div className="flex flex-col gap-[14px]">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="w-fit text-[12px] text-white/65 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-[13px] font-bold text-white">
              {t("footer.contactInfo")}
            </h3>

            <div className="flex flex-col gap-5">
              {address && (
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt
                    size={16}
                    className="mt-[2px] shrink-0 text-white"
                  />

                  <p className="max-w-[260px] text-[12px] leading-[1.7] text-white/65">
                    {address}
                  </p>
                </div>
              )}

              {phone && (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="flex items-center gap-3 text-[12px] text-white/65 transition-colors hover:text-white"
                >
                  <FaPhoneAlt
                    size={16}
                    className="shrink-0 text-white"
                  />

                  <span>{phone}</span>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-[12px] text-white/65 transition-colors hover:text-white"
                >
                  <FaEnvelope
                    size={16}
                    className="shrink-0 text-white"
                  />

                  <span>{email}</span>
                </a>
              )}

              {map && (
                <a
                  href={map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-white/65 transition-colors hover:text-white"
                >
                  {t("footer.map")}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 pb-1 pt-[45px] sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[300px] text-[11px] leading-[1.5] text-white/45">
            {t("footer.copyright")}
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy-policy"
              className="text-[11px] text-white/45 transition-colors hover:text-white"
            >
              {t("footer.privacyPolicy")}
            </Link>

            <Link
              to="/terms"
              className="text-[11px] text-white/45 transition-colors hover:text-white"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
