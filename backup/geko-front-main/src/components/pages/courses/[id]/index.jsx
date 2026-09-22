import React, { useLayoutEffect, useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TbClockHour9 } from 'react-icons/tb'
import { IoLanguage } from 'react-icons/io5'
import { PiStudentBold } from 'react-icons/pi'
import { MdAssessment } from 'react-icons/md'
import { PiCertificate } from "react-icons/pi";
import Error404 from '../../shared/Error'
import { A11y, Autoplay, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

import PopularCourse from "../../shared/home/PopularCourse";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { BASE_URL } from '../../../../utils/utils';
import { renderBullet } from '../../../../utils/utils';
import { fetchCourses } from '../../../../redux/dataSlice';


export default function CoursePage() {
    const nav = useNavigate();
    const { t, i18n } = useTranslation();
    const { id: coursesID, } = useParams()
    const [slidesToShow, setSlidesToShow] = useState(3)
    const [spaceBetween, setSpaceBetween] = useState(30)

    const courses = useSelector(state => state.data.courses);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch, i18n.language]);

    let pickedCourse = courses.length > 0 ? courses.find(course => Number(course.id) === Number(coursesID)) : null;

    useLayoutEffect(() => {
        function updateSlidesToShow() {
            const screenWidth = window.innerWidth
            if (screenWidth >= 992) {
                setSlidesToShow(3)
                setSpaceBetween(30)
            } else if (screenWidth >= 480) {
                setSlidesToShow(2)
                setSpaceBetween(10)
            } else {
                setSlidesToShow(1)
                setSpaceBetween(30)
            }
        }

        updateSlidesToShow()
        window.addEventListener('resize', updateSlidesToShow)
        return () => {
            window.removeEventListener('resize', updateSlidesToShow)
        }
    }, [])


    const shouldLoop = courses.length > slidesToShow;

    const slides = useMemo(() => {
        return courses.slice(0, 6).map(({ image, id, translation }) => (
            <SwiperSlide key={id}>
                <PopularCourse
                    id={id}
                    image={image}
                    title={translation.title}
                />
            </SwiperSlide>
        ));
    }, [courses]);

    return (
        <section className="bgColorArticle md:before:h-[250px] before:h-[0] relative pb-5">
            {pickedCourse?.id ? (
                <>
                    <article className="grid  md:grid-cols-[70%_1fr] grid-cols-1 max-w-[1200px] mx-[auto] relative">
                        <div className="flex flex-col relative px-auto text-pseudo pt-[75px] justify-center py-10">
                            <div className="flex flex-col gap-[20px] px-5">
                                <p className="text-3xl font-roboto-slab">{pickedCourse.translation.title}</p>
                                <div className="flex flex-col gap-[5px]">
                                    <p className="text-xs capitalize">{t("Categories")}</p>
                                    <p className="text-custom-15">{t(pickedCourse.category.translation.text)}</p>
                                </div>
                            </div>

                            <div className="w-[100%] flex md:hidden  h-[100%] absolute bg-primaryDark z-[-1]">
                            </div>
                        </div>

                        <div
                            className="flex flex-col lg:mx-1 mx-5  md:sticky static border-[1px]  top-1 mt-8  h-min  gap-[10px]"
                            style={{
                                gridRow: "span 2",
                                backgroundColor: 'rgb(231,231,231)'
                            }}>

                            <img
                                src={pickedCourse?.image && typeof pickedCourse?.image === 'string' && pickedCourse?.image.startsWith('https')
                                    ? pickedCourse?.image
                                    : pickedCourse?.image
                                        ? `${BASE_URL}${pickedCourse?.image}`
                                        : 'https://eduma.thimpress.com/wp-content/uploads/2022/07/thumnail-cate-7-170x170.png'}
                                alt={pickedCourse.translation.title} />
                            <div className='w-full px-5'>
                                <button
                                    onClick={() => nav(`/contacts`)}
                                    className="self-center w-[100%] py-[10px] px-[25px] rounded-[4px] uppercase font-bold text-white text-sm bg-primary">
                                    {t("Sign_Up")}
                                </button>
                                <h1 className="text-center text-xl pb-3 font-roboto-slab font-bold text-primaryDark pt-[20px]">
                                    <p className='text-primaryDark'>{t("Course_Features")}</p>
                                </h1>
                            </div>

                            <div
                                className="w-full flex flex-col justify-start items-start px-[20px] gap-[10px] ">
                                <div
                                    className="w-full flex items-center justify-between gap-3 text-primaryDark text-custom-15">
                                    <div className='flex items-center justify-center gap-1'>
                                        <TbClockHour9 className="text-primary" />
                                        <p className='text-primaryDark capitalize'>{t("Duration")}</p>
                                    </div>
                                    <p className='text-primaryDark capitalize'>
                                        {t(pickedCourse.duration)}
                                    </p>
                                </div>
                                <div
                                    className="w-full flex items-center justify-between gap-3 text-color60 text-custom-15">
                                    <div className='flex items-center justify-center gap-1'>
                                        <IoLanguage className="text-primary" />
                                        <p className='text-primaryDark capitalize'>{t("Language")}</p>
                                    </div>
                                    <div className='flex gap-3'>
                                        <img src={'/images/flags/Armenia-flag.webp'} alt="" className='w-[16px]' />
                                        <img src={'/images/flags/USA-flag.webp'} alt="" className='w-[16px]' />
                                        <img src={'/images/flags/Russia-flag.webp'} alt="" className='w-[16px]' />
                                    </div>
                                </div>
                                <div
                                    className="w-full flex items-center justify-between gap-3 text-color60 text-custom-15">
                                    <div className='flex items-center justify-center gap-1'>
                                        <PiStudentBold className="text-primary" />
                                        <p className='text-primaryDark capitalize'>{t("Students")}</p>
                                    </div>
                                    <p className='text-primaryDark capitalize'>
                                        {t(pickedCourse.students)}
                                    </p>

                                </div>
                                <div
                                    className="w-full flex items-center justify-between gap-3 text-color60 text-custom-15">
                                    <div className='flex items-center justify-center gap-1'>
                                        {/* <img src={'/images/education.webp'} alt="" /> */}
                                        <p className='text-primaryDark capitalize'>{t("StudentGroup")}</p>
                                    </div>
                                    <p className='text-primaryDark capitalize'>
                                        {t(pickedCourse.studentGroup)}
                                    </p>
                                </div>
                                <div
                                    className="w-full flex items-center justify-between gap-3 text-color60 text-custom-15">
                                    <div className='flex items-center justify-center gap-1'>
                                        <MdAssessment className="text-primary" />
                                        <p className='text-primaryDark capitalize'>{t("Assessments")}</p>
                                    </div>
                                    <p className='text-primaryDark capitalize'> {t(pickedCourse.assessments)}</p>
                                </div>
                                <div
                                    className="w-full flex items-center justify-between gap-3 text-color60 text-custom-15">
                                    <div className='flex items-center justify-center gap-1'>
                                        <PiCertificate className="text-primary" />
                                        <p className='text-primaryDark capitalize'>{t('CERTIFICATE')}</p>
                                    </div>
                                    <p className='text-primaryDark capitalize'>{t(pickedCourse.certification)}</p>
                                </div>
                                <p className="text-custom-15 text-color60 uppercase"></p>
                            </div>
                            <div className='w-full px-5 pb-5'>
                                <ul className="flex px-[9px] justify-center items-center gap-3 w-full pt-3">
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

                                    {/* Instagram link */}
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
                        <div className="pr-2 md:order-none py-10 px-5  order-2">
                            <div className="text-start pt-5 flex flex-col gap-3">
                                <h1 className="text-lg font-roboto-slab font-bold text-primaryDark">
                                    {t('COURSE_DESCRIPTION')}
                                </h1>
                                <p className="text-custom-15 text-primaryDark">{pickedCourse.translation.desc}</p>
                            </div>
                            <p className="like relative uppercase font-roboto-slab text-2xl pt-10 font-bold">
                                {t("You_May_Like")}
                            </p>
                            <Swiper
                                modules={[Pagination, A11y, Autoplay]}
                                spaceBetween={spaceBetween}
                                slidesPerView={slidesToShow}
                                loop={shouldLoop}
                                pagination={{
                                    clickable: true,
                                    dynamicBullets: true,
                                    dynamicMainBullets: 2,
                                    renderBullet,
                                }}
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

                    </article>

                </>
            ) : (
                <Error404 />
            )}
        </section>
    )
}
