import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGES, NAV_ITEMS } from "./header.js";
import { useEffect, useState } from "react";
import { api } from "../../api/client";
import "./header.css";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [uiBlocks, setUiBlocks] = useState([]);

  useEffect(() => {
    const getUIBlocks = async () => {
      try {
        const response = await api.get("/ui-blocks/");
        setUiBlocks(response.data);
      } catch (error) {
        console.error("Failed to load UI blocks:", error);
      }
    };

    getUIBlocks();
  }, [i18n.language]);

  const headerBlock = uiBlocks.find(
    (block) => block.key === "header"
  );

  const contactsBarBlock = uiBlocks.find(
    (block) => block.key === "contacts_bar"
  );

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__top-left">
          {contactsBarBlock?.phone && (
            <a href={`tel:${contactsBarBlock.phone}`}>
              <span>☎</span>
              {contactsBarBlock.phone}
            </a>
          )}

          {contactsBarBlock?.email && (
            <a href={`mailto:${contactsBarBlock.email}`}>
              <span>✉</span>
              {contactsBarBlock.email}
            </a>
          )}
        </div>

        <div className="header__top-right">
          <span className="header__follow">Follow us:</span>

          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="Instagram">◎</a>
          <a href="#" aria-label="LinkedIn">in</a>

          <span className="header__separator"></span>

          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => i18n.changeLanguage(lang.code)}
              className="header__language"
            >
              {lang.code.toUpperCase()}
              <span>⌄</span>
            </button>
          ))}
        </div>
      </div>

      <div className="header__main">
        <Link to="/" className="header__logo">
          <img src="/images/logo.webp" alt="GEKO" />
        </Link>

        <nav className="header__nav">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to}>
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <Link
            to="/contacts"
            className="header__button header__button--outline"
          >
            Enroll Now
          </Link>

          <Link
            to="/contacts"
            className="header__button header__button--filled"
          >
            Free Trial Class
          </Link>
        </div>
      </div>
    </header>
  );
}