import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import { FaMapMarkerAlt } from "react-icons/fa";
import { TbClockHour9 } from 'react-icons/tb'
import { FaFlag } from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { fetchEventById } from '../../../../redux/dataSlice';
import { getImageUrl } from '../../../../utils/utils';

export default function EventsPage() {
    const { t, i18n } = useTranslation();
    const { id: eventId } = useParams();
    const nav = useNavigate();
    const dispatch = useDispatch();

    const pickedEvent = useSelector(state => state.data.events.find(event => event.id === Number(eventId)));

    useEffect(() => {
        dispatch(fetchEventById(eventId));
    }, [dispatch, eventId, i18n.language]);

    const slides = useMemo(() => {
        return pickedEvent.event_galleries?.length > 0
            ? pickedEvent.event_galleries.map(({ image, id }) => (
                <SwiperSlide
                    key={id}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <img src={getImageUrl(image)} alt="" className="h-full w-full object-cover" />
                </SwiperSlide>
            ))
            : (
                <img
                    src={getImageUrl(pickedEvent.image)}
                    alt={"image " + t(pickedEvent.description)}
                    className="h-full w-full object-cover"
                />
            );
    }, [pickedEvent, t]);

    if (!pickedEvent) {
        return (
            <section className="md:before:h-[22%] before:h-[0] py-5 relative pb-5">
                <article className="grid  md:grid-cols-[70%_1fr] grid-cols-1 max-w-[1300px] mx-[auto] relative">
                    <div className="flex flex-col gap-[20px] px-5">
                        <Skeleton height={50} width={200} />
                        <Skeleton height={30} width={300} />
                        <article className={'w-full '}>
                            <Skeleton height={400} />
                        </article>
                    </div>

                    <div
                        className="flex flex-col lg:mx-1 mx-5  md:sticky static  top-1 mt-8 h-min gap-[10px] bg-pseudo">
                        <div className="w-full  text-white">
                            <Skeleton height={50} />
                        </div>

                        <div className="flex flex-col justify-start items-start px-[20px] py-[20px] gap-[20px]">
                            <Skeleton height={40} width={150} />
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-[75%_20%] justify-between grid-cols-1 py-5 px-5">
                        <div className="text-start pt-5 flex flex-col gap-3">
                            <Skeleton height={30} width={200} />
                            <Skeleton count={3} height={20} />
                            <div className="flex items-center">
                                <Skeleton circle={true} height={32} width={32} />
                                <Skeleton circle={true} height={32} width={32} />
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col ">
                                <div className="flex gap-3 text-color60 text-custom-15 border-b-[2px] border-colorF2 py-3">
                                    <Skeleton height={20} width={150} />
                                </div>
                                <div className="flex gap-3 text-color60 text-custom-15 border-b-[2px] border-colorF2 py-3">
                                    <Skeleton height={20} width={150} />
                                </div>
                                <div className="flex gap-3 text-color60 text-custom-15 py-3">
                                    <Skeleton height={20} width={150} />
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        );
    }

    const start_date = new Date(pickedEvent.start_date);
    const end_date = new Date(pickedEvent.end_date);

    return (
        <section className="md:before:h-[22%] before:h-[0] py-5 relative pb-5">
            <article className="grid  md:grid-cols-[70%_1fr] grid-cols-1 max-w-[1300px] mx-[auto] relative">
                <div className="flex flex-col gap-[20px] px-5">
                    <p className="text-5xl text-primaryDark font-roboto-slab font-bold">{t("EVENTS")}</p>
                    <p className="text-2xl font-bold text-primaryDark font-roboto-slab">{t(pickedEvent.translation.title)}</p>
                    {/*<img src={pickedEvent.image} alt=""/>*/}

                    <article className={'w-full '}>
                        <Swiper
                            slidesPerView={1}
                            loop={pickedEvent.event_galleries?.length > 1}
                            modules={[Pagination, A11y]}
                            speed={500}
                        >
                            {slides}
                        </Swiper>
                    </article>
                </div>

                <div
                    className="flex  flex-col lg:mx-1 mx-5  md:sticky static border-[1px]  top-1 mt-8  h-min  gap-[10px] bg-pseudo">
                    <div className="w-full bg-primary text-white">
                        <p className="text-2xl font-roboto-slab-sans font-bold text-center p-5">{t(pickedEvent.translation.title)}</p>
                    </div>

                    <div className="flex flex-col justify-start items-start px-[20px] py-[20px] gap-[20px]">
                        <button
                            onClick={() => nav(`/contacts`)}
                            className="self-center w-[100%] py-[10px] px-[25px] text-white rounded-[4px] uppercase font-bold text-sm bg-primary">
                            {t('Sign_Up')}
                        </button>
                    </div>
                </div>
                <div className="grid sm:grid-cols-[75%_20%] justify-between grid-cols-1 py-5 px-5">
                    <div className="text-start pt-5 flex flex-col gap-3">
                        <h1 className="text-2xl font-roboto-slab font-bold text-primaryDark uppercase">
                            {t("event_description")}
                        </h1>
                        <p className="text-custom-15 text-color60">{t(pickedEvent.translation.description)}</p>
                        <div className="flex items-center">
                            <p className="text-color66 capitalize">{t("share")}:</p>
                            <ul className="flex px-[9px] gap-3 w-full">
                                <li className="flex items-center justify-center w-[32px] h-[32px] border-2 rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300">
                                    <a href="https://www.facebook.com/GekoOnlineEducation/" target="_blank"
                                        rel="noopener noreferrer">
                                        <FontAwesomeIcon
                                            icon={faFacebookF}
                                            size="lg"
                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                        />
                                    </a>
                                </li>

                                <li className="flex items-center justify-center w-[32px] h-[32px] border-2 rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300">
                                    <a href="https://www.instagram.com/geko_education" target="_blank"
                                        rel="noopener noreferrer">
                                        <FontAwesomeIcon
                                            icon={faInstagram}
                                            size="lg"
                                            className="text-pink-600 hover:text-pink-800 transition-colors duration-300"
                                        />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col ">
                            <div
                                className="flex gap-3 text-color60 text-custom-15 border-b-[2px] border-colorF2 py-3">
                                <TbClockHour9 className="text-primary" />
                                <div className="flex flex-col gap-1">
                                    <p className="text-primaryDark font-bold">{t('Start_Time')}</p>
                                    <p>{`${start_date.getDate()}/${start_date.getMonth()}/${start_date.getFullYear()}`}</p>
                                </div>
                            </div>
                            <div
                                className="flex gap-3 text-color60 text-custom-15 border-b-[2px] border-colorF2 py-3">
                                <FaFlag className="text-primary" />
                                <div className="flex flex-col gap-1 ">
                                    <p className="text-primaryDark font-bold">{t('Finish_Time')}</p>
                                    <p>{`${end_date.getDate()}/${end_date.getMonth()}/${end_date.getFullYear()}`}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 text-color60 text-custom-15 py-3">
                                <FaMapMarkerAlt className="text-primary" />
                                <div className="flex flex-col gap-1">
                                    <p className="text-primaryDark font-bold">Address</p>
                                    <p>
                                        Online
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </section>
    )
}
