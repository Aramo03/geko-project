import LanguageSwitcher from './LanguageSwitcher';
import Menu from './Menu';
import {BsTelephone} from 'react-icons/bs';
import {LuMailCheck} from 'react-icons/lu';
import {useState} from 'react';
import MobileMenu from './MobileMenu';

export default function Header() {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <header className="flex flex-col">
              <div className=" bg-secondary">
                <div
                    className="py-[10px] gap-3 text-pseudo flex items start max:items-center max:flex-row flex-col max:justify-between max:px-3 px-5 max-w-[1200px] mx-auto">
                    <div className="w-70 flex md:flex-row flex-col md:items-center gap-3 justify-between">
                        <div className={'flex items-center gap-3'}>
                            <BsTelephone/>
                            <span>(+374) 98 03 33 94</span>
                        </div>
                        <div className={'flex items-center gap-3'}>
                            <LuMailCheck/>
                            <span>gekoeducation@gmail.com</span>
                        </div>
                    </div>
                    <LanguageSwitcher/>
                </div>
            </div>
            <div>
                <Menu toggleMenu={toggleMenu} showMenu={showMenu}/>
            </div>
            <MobileMenu isOpen={showMenu} toggleMenu={toggleMenu}/>
        </header>
    );
}
