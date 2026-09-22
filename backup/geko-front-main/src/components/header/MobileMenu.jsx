import { Link, useLocation } from 'react-router-dom';
import { routesArray } from '../../entities/routesArray';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';

export default function MobileMenu({ isOpen, toggleMenu }) {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <div
      className={`fixed capitalized 	 bg-pseudo w-[50%] inset-0 z-50 overflow-y-auto transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="bg-gray-400 w-full h-[60px] flex items-center justify-end px-5">
        <button onClick={toggleMenu}>
          <FiX className="w-6 h-6" />
        </button>
      </div>
      <div className="px-2 pt-2 pb-3  space-y-1">
        {routesArray.map((route) => (
          <Link
            key={route.id}
            to={route.path}
            onClick={toggleMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === route.path ? 'text-primary' : 'text-secondary'
            }`}
          >
            {t(route.name)}
          </Link>
        ))}
      </div>
    </div>
  );
}
