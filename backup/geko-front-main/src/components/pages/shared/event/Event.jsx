import React, { useState, useMemo } from 'react';
import { MdOutlinePlace } from 'react-icons/md';
import { TbClockHour3 } from 'react-icons/tb';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import { getImageUrl } from '../../../../utils/utils';

export default function Event({ pickedEvent }) {
    const nav = useNavigate();
    const { t } = useTranslation();

    const handleCategoryClick = (id) => {
        nav(`/events/${pickedEvent.status}/${id}`);
    };

    const [isMenuVisible, setMenuVisible] = useState(false);

    const handleMouseEnter = () => {
        setMenuVisible(true);
    };

    const handleMouseLeave = () => {
        setMenuVisible(false);
    };

    if (!pickedEvent) {
        return <div>{t('Event not found')}</div>; // Fallback message when event is not found
    }
    const date = new Date(pickedEvent.start_date);

    // Извлекаем день, месяц и год
    const day = date.getDate(); // День
    const month = date.getMonth() + 1; // Месяц (нумерация начинается с 0)
    const year = date.getFullYear(); // Год

    const slides = useMemo(() => {
        return pickedEvent.event_galleries && pickedEvent.event_galleries.length > 0
            ? pickedEvent.event_galleries.map(({ image, id }) => (
                <SwiperSlide key={id}>
                    <img alt={"image " + t(pickedEvent.description)} src={getImageUrl(image)}
                        className="rounded-md w-full" />
                </SwiperSlide>
            ))
            : (
                <img alt={"image " + t(pickedEvent.description)} src={getImageUrl(pickedEvent.image)}
                    className="rounded-md w-full" />
            );
    }, [pickedEvent, t]);

    return (
        <section
            className="border-b-[1px] py-8 border-gray-300 flex gap-5 sm:justify-between sm:items-center sm:flex-row flex-col max:relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={`sm:flex hidden  flex-col gap-1 sm:static w-[200px] max:w-[100px] md:mr-10 mr-0 max:bg-white max:text-center max:absolute max:top-[10%] max:left-[3%] ${isMenuVisible ? 'border-color56' : ''}`}
            >
                <span className="text-primary font-bold text-6xl leading-60">
                    {day}
                </span>
                <span className="text-color60 leading-[25px] font-sans-serif">{t(pickedEvent.month)}</span>
            </div>

            <div
                className="gap-2 flex middle:px-5 md:px-20 px-0 flex-col sm:order-none max:order-1 sm:max-w-[60%] max-w-full">
                <h5 className="text-lg font-bold hover:text-primary transition-colors duration-300 cursor-pointer"
                    onClick={() => handleCategoryClick(pickedEvent.id)}
                >{t(pickedEvent.translation.title)}</h5>
                <div className="flex gap-1 items-center">
                    <TbClockHour3 className="text-primary w-[21px]" /> <span
                        className="text-sm">{`${day}/${month}/${year}`}</span>
                    <MdOutlinePlace className="text-primary" /> <span
                        className="text-sm">{t(pickedEvent.translation.place)}</span>
                </div>
                <p className=" text-primaryDark text-custom-15 center">{t(pickedEvent.translation.description)}</p>
            </div>

            <div className='w-full md:w-[30%] sm:w-[40%]'>
                <Swiper
                    slidesPerView={1}
                    loop={pickedEvent.event_galleries.length > 1}
                    modules={[A11y, Autoplay]}
                    speed={500}
                    autoplay={{
                        delay: 1500,
                        pauseOnMouseEnter: true,
                        disableOnInteraction: false,
                    }}
                >
                    {slides}
                </Swiper>
            </div>
        </section>
    );
}
