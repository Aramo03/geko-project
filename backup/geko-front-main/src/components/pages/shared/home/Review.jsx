import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector, useDispatch } from 'react-redux';
import { BASE_URL } from '../../../../utils/utils';
import { fetchReviews } from '../../../../redux/dataSlice';

export default function Review() {
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(0);

    const reviews = useSelector(state => state.data.reviews);

    const thumbnailSliderRef = useRef(null);
    const contentSliderRef = useRef(null);

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
        centerPadding: "20px",  // Padding to show slides on the left and right
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
                    {reviews.map((review, i) => (
                        <div key={i} className='flex justify-center h-[200px]'>
                            <div className="flex justify-center items-center w-full h-full">
                                <img
                                    src={review?.image && typeof review?.image === 'string' && review?.image.startsWith('https')
                                        ? review?.image
                                        : review?.image
                                            ? `${BASE_URL}${review?.image}`
                                            : 'https://eduma.thimpress.com/wp-content/uploads/2022/07/thumnail-cate-7-170x170.png'}
                                    className="rounded-full p-2 border-color86"
                                    style={{
                                        border: i === currentIndex ? '2px dotted rgba(0, 0, 0, 0.5)' : 'none',
                                        opacity: i === currentIndex ? '1' : '0.5',
                                        width: i === currentIndex ? '130px' : '100px',
                                        height: i === currentIndex ? '130px' : '100px',
                                        transition: 'all 0.3s ease',
                                    }}
                                    alt={`user ${review.name}`}
                                />
                            </div>
                        </div>
                    ))}
                </Slider>

                {/* Content Slider */}
                <Slider ref={contentSliderRef} {...contentSettings}>
                    {reviews.map((review, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="flex justify-center items-center text-center flex-col">
                                <p className="mt-5 text-primaryDark font-bold text-lg">{review.name}</p>
                                <p className="mb-7 text-center text-primaryDark">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
