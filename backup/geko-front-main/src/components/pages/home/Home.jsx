import React, { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import Course from '../shared/home/Course';
import MainPhoto from './MainPhoto';
import PopularCourse from '../shared/home/PopularCourse';
import LessonInfo from '../shared/home/LessonInfo';
import Event from '../shared/event/Event';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import RegisterForm from "./RegisterForm";
import Reviews from '../shared/home/Review';
import "react-loading-skeleton/dist/skeleton.css";
import { fetchCourses, fetchEvents, fetchLessonInfo, fetchReviews } from '../../../redux/dataSlice';

export default function Home() {
    const { t, i18n } = useTranslation();

    const events = useSelector(state => state.data.events);
    const courses = useSelector(state => state.data.courses);
    const lessonInfo = useSelector(state => state.data.lessonInfo);
    const loading = useSelector(state => state.data.loading);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchEvents());
        dispatch(fetchLessonInfo());
        dispatch(fetchReviews());
    }, [dispatch, i18n.language]);

    const nav = useNavigate();
    const handleCategoryClick = () => {
        nav(`/course-category`);
    };

    const handleEventsClick = () => {
        nav(`/events`);
    };

    return (
        <main>
            <div
                className='relative md:flex gap-5 grid grid-rows-[min-content_1fr] md:justify-end justify-center items-center py-5 md:px-5'>
                <MainPhoto />
                <div
                    className="relative top-0 mx-auto md:mx-0 h-auto flex flex-col justify-center items-center z-20 overflow-hidden border-[1px] rounded-[20px]">
                    <div className="absolute w-[100%] h-[100%] bg-primary rounded-full z-10"></div>
                    <RegisterForm />
                </div>
            </div>
            <Course />
            <div className="flex content-center justify-center gap-20 py-1">
                <div className='popularDiv mx-[auto] px-5'>
                    <div className="flex md:flex-row flex-col md:justify-between gap-3 pb-5">
                        <h1 className="text-custom-28 font-roboto-slab font-bold text-primaryDark">
                            {t('popular_cours')}
                        </h1>
                        <button
                            className="text-sm uppercase font-light border-2 px-[20px] py-[7px] h-[50%] rounded-[4px] w-max"
                            onClick={() => handleCategoryClick()}>
                            {t('View_All')}
                        </button>
                    </div>

                    <div className="popular grid md:grid-cols-4 sm500:grid-cols-2 grid-cols-1 gap-12">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="p-4">
                                    <Skeleton height={200} />
                                    <Skeleton height={20} width={`80%`} style={{ margin: '10px 0' }} />
                                </div>
                            ))
                        ) : (
                            courses.map(({ image, id, translation }) => (
                                <PopularCourse
                                    id={id}
                                    image={image}
                                    title={translation.title}
                                    key={id}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className=" gap-20 py-10" style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${'/images/books.webp'})`,
            }}>
                <div
                    className='popularDiv max-w-[1300px] mx-[auto] bg-cover gap-5 bg-no-repeat md:grid grid-cols-5 flex lg:justify-center items-center flex-col'>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="p-4">
                                <Skeleton circle={true} height={50} width={50} />
                                <Skeleton height={20} width={`60%`} style={{ margin: '10px 0' }} />
                            </div>
                        ))
                    ) : (
                        lessonInfo.map(({ id, image, translation }) => (
                            <LessonInfo key={id} image={image} title={translation.title} />
                        ))
                    )}
                </div>
            </div>
            <div className="text-start pt-20  flex justify-center">
                <div className='popularDiv max-w-[1300px] px-10 lg:px-0 '>
                    <div className="flex md:flex-row flex-col md:justify-between gap-3">
                        <h1 className="text-custom-28 font-roboto-slab font-bold text-primaryDark">
                            {t('EVENTS')}
                        </h1>
                        <button
                            className="text-sm uppercase font-light border-2 py-[7px] px-[20px] h-[50%] rounded-[4px] w-max"
                            onClick={() => handleEventsClick()}>
                            {t('View_All')}
                        </button>
                    </div>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="p-4">
                                <Skeleton height={150} />
                                <Skeleton height={20} width={`80%`} style={{ margin: '10px 0' }} />
                            </div>
                        ))
                    ) : (
                        events.filter(event => event.status === "completed")
                            .slice(0, 3).map((pickedEvent) => (
                                <Event
                                    key={pickedEvent.id}
                                    pickedEvent={pickedEvent}
                                />
                            ))
                    )}
                </div>
            </div>

            <div className='flex flex-col justify-center overflow-hidden'>
                <div className="text-center lg:px-20 px-5 pt-10 pb-5">
                    <h1 className="text-custom-28 font-roboto-slab font-bold text-primaryDark">
                        {t('What_People_Say')}
                    </h1>
                </div>
                <div className="text-start lg:px-20 px-5 pt-5 min-h-[380px]">
                    {loading ? (
                        <Skeleton height={200} width={`100%`} />
                    ) : (
                        <Reviews />
                    )}
                </div>
            </div>
        </main>
    );
}
