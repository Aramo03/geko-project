import React, {useState, useLayoutEffect, useRef, useEffect} from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector, useDispatch } from 'react-redux';
import { BASE_URL } from '../../../../utils/utils';
import { fetchTeams } from '../../../../redux/dataSlice';
import { useTranslation } from 'react-i18next';

export default function Team() {
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { i18n } = useTranslation();
    // Create refs for both sliders
    const thumbnailSliderRef = useRef(null);
    const contentSliderRef = useRef(null);

    const teams = useSelector(state => state.data.teams);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTeams());
    }, [dispatch, i18n.language]);

    useLayoutEffect(() => {
        function updateSlidesToShow() {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 768) setSlidesToShow(3);
            else setSlidesToShow(1);
        }

        updateSlidesToShow();
        window.addEventListener("resize", updateSlidesToShow);
        return () => window.removeEventListener("resize", updateSlidesToShow);
    }, []);

    const syncSliders = (next) => {
        setCurrentIndex(next);
        thumbnailSliderRef.current.slickGoTo(next);
        contentSliderRef.current.slickGoTo(next);
    };

    const thumbnailSettings = {
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
        infinite: true,
        centerMode: true,
        centerPadding: "20px",
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        speed: 500,
        beforeChange: (_, next) => syncSliders(next),
    };

    const contentSettings = {
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        // adaptiveHeight: true,
        fade: true,
        beforeChange: (_, next) => syncSliders(next),
    };

    return (
        <div className="flex justify-center relative">
            <div className='min-w-[1%] max-w-full md:max-w-[60%] sm:max-w-[80%]'>
                <Slider ref={thumbnailSliderRef} {...thumbnailSettings}>
                    {teams.map((team, i) => (
                        <div key={i} className='flex justify-center h-[150px]'>
                            <div className="flex justify-center items-center w-full h-full">
                                <img
                                    src={team?.image && typeof team?.image === 'string' && team?.image.startsWith('https')
                                        ? team?.image
                                        : team?.image
                                            ? `${BASE_URL}${team?.image}`
                                            : 'https://eduma.thimpress.com/wp-content/uploads/2022/07/thumnail-cate-7-170x170.png'}
                                    className="rounded-full p-2 border-color86"
                                    style={{
                                        border: i === currentIndex ? '2px dotted rgba(0, 0, 0, 0.5)' : 'none',
                                        opacity: i === currentIndex ? '1' : '0.5',
                                        width: i === currentIndex ? '130px' : '100px',
                                        height: i === currentIndex ? '130px' : '100px',
                                        transition: 'all 0.3s ease',
                                    }}
                                    alt={`user ${team.translation.name}`}
                                />
                            </div>
                        </div>
                    ))}
                </Slider>

                {/* Content Slider */}
                <Slider ref={contentSliderRef} {...contentSettings}>
                    {teams.map((team, i) => (
                        <div key={i} style={{display: 'flex', justifyContent: 'center'}}>
                            <div className="flex justify-center items-center text-center flex-col">
                                <p className="mt-5 text-primaryDark font-black text-xl uppercase">{team.translation.name}</p>
                                <p className="text-primaryDark text-lg capitalize">{team.translation.role}</p>
                                <p className="my-5 text-center text-primaryDark">{team.translation.desc}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
