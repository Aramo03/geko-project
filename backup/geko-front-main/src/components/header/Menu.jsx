import { Link, useLocation } from 'react-router-dom';
import { routesArray } from '../../entities/routesArray';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX } from 'react-icons/fi';
import Logo from '../pages/shared/Logo';

export default function Menu({ showMenu, toggleMenu }) {
    const { pathname } = useLocation(); // Получаем текущий путь
    const { t } = useTranslation();

    return (
        <nav
            className="flex items-center justify-between bg-pseudo text-secondary max:px-5 max-w-[1200px] mx-auto py-[10px]">
            <div className="flex items-center flex-shrink-0 mr-6">
                <span className="font-semibold text-xl tracking-tight">
                    <Logo />
                </span>
            </div>
            <div className="md:hidden">
                <button onClick={toggleMenu}>
                    {showMenu ? (
                        <FiX className="text-secondary" size={30} />
                    ) : (
                        <FiMenu className="text-secondary" size={30} />
                    )}
                </button>
            </div>
            <div className="flex uppercase hidden md:block">
                {routesArray.map((route) => (
                    <Link
                        key={route.id}
                        to={route.path}
                        className={`relative group px-3 py-2 rounded-md text-sm font-medium ${pathname === route.path || (pathname?.startsWith(route?.path) && route?.path !== '/')
                            ? 'text-primary'
                            : 'text-secondary hover:text-primary'
                            }`}
                    >
                        {t(route.name)}
                        <span
                            className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"></span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
