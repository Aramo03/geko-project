import React, { useState, useEffect } from 'react';
import Logo from '../pages/shared/Logo';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdOutlinePlace, MdMarkEmailRead } from 'react-icons/md';
import { routesArray } from '../../entities/routesArray';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import socialsArray from '../../entities/socialsArray';

const Footer = () => {
    const { t } = useTranslation();

    const marker = {
        longitude: 44.522213,
        latitude: 40.189774,
    };

    const [isMapVisible, setIsMapVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const mapElement = document.getElementById('map-container');
            if (mapElement && mapElement.getBoundingClientRect().top < window.innerHeight) {
                setIsMapVisible(true);
                window.removeEventListener('scroll', handleScroll);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <footer className="flex bg-black text-pseudo h-[auto]">
            <div
                className="md:grid flex flex-col md:grid-cols-[1fr_max-content_1fr_min-content] md:grid-rows-[20%_1fr] justify-center px-5 py-16 mx-[auto] gap-5 max-w-[1300px]">
                <Logo />
                <div className="flex flex-col gap-5 row-start-2">
                    <div className="flex">
                        <FaPhoneAlt className="mx-2 text-primary" />
                        <p>(+374) 98 03 33 94</p>
                    </div>
                    <div className="flex">
                        <MdOutlinePlace className="mx-2 text-primary" />
                        <p className='w-[80%] middle:w-60%'>
                            {t("contact1_description")}
                        </p>
                    </div>
                    <div className="flex">
                        <MdMarkEmailRead className="mx-2 text-primary" />
                        <p>gekoeducation1@gmail.com</p>
                    </div>
                </div>
                <ul className='flex flex-col items-center content-start flex-wrap gap-3 row-span-2 col-start-2'>
                    {routesArray.map(({ path, name, id }) => {
                        return (
                            <li className='flex justify-start w-full font-bold' key={id}>
                                <Link to={path}>
                                    {t(name)}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                <div id="map-container" className="map-container column-start-3 row-span-2 w-full h-auto rounded-md overflow-hidden">
                    {isMapVisible && (
                        <img
                            src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-marker+ff0000(${marker.longitude},${marker.latitude})/${marker.longitude},${marker.latitude},18,0/800x600?access_token=YOUR_MAPBOX_TOKEN` }
                            alt="Static Map with Marker"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <ul className='column-start-4 flex gap-3'>
                    {
                        socialsArray.map(({ id, name, Icon, href }) => {
                            return (
                                <a href={href} key={id} target='_blank' rel="noopener noreferrer">
                                    <Icon title={name} key={id} className='text-white text-3xl' />
                                </a>
                            )
                        })
                    }
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
