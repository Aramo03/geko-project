import { useTranslation } from 'react-i18next';
export default function LanguageSwitcher() {
  const lngs = {
    en: { nativeName: 'English', flag: '/images/flags/USA-flag.webp' },
    am: { nativeName: 'Armenian', flag: '/images/flags/Armenia-flag.webp' },
    ru: { nativeName: 'Russian', flag: '/images/flags/Russia-flag.webp' },
  };

  const { i18n } = useTranslation();

  return (
    <div className='flex bg-white rounded w-min'>
      {Object.keys(lngs).map((lng) => (
        <button
          key={lng}
          type="submit"
          onClick={() => i18n.changeLanguage(lng)}
          title={lngs[lng].nativeName}
          className={`w-[35px] h-[26px] m-[3px] p-1 ${i18n.resolvedLanguage === lng ? 'bg-secondary rounded ' : ''
            }`}
        >
          <img alt={lngs[lng].nativeName} src={lngs[lng].flag} className='w-[27px] h-[18px]'/>
        </button>
      ))}
    </div>
  );
}
