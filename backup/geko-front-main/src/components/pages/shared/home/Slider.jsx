
import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import reviewsArray from "../../../../entities/reviewsArray";

const CustomSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [middleItemIndex, setMiddleItemIndex] = useState(0);
    const items = reviewsArray

    const onMiddleItemIndexChange = (index) => {
        setMiddleItemIndex(index);
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '60px',
        initialSlide: 0,
        beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    };

    const handleSwipe = () => {
        const slickList = document.querySelector('.slick-list');
        if (slickList) {
            const slickListRect = slickList.getBoundingClientRect();
            const slideWidth = slickListRect.width / settings.slidesToShow;
            const centerOffset = (slickListRect.width - slideWidth) / 2;
            const newSlide = Math.round((slickList.scrollLeft + centerOffset) / slideWidth);
            setCurrentSlide(newSlide);
            onMiddleItemIndexChange(newSlide);
        }
    };

    return (
        <Slider {...settings} onSwipe={handleSwipe}>
            {items.map(({id,name}, index) => (
                <div key={id} className={index === currentSlide ? 'slider-item central' : 'slider-item'}>
                    {name}
                </div>
            ))}
        </Slider>
    );
};

export default CustomSlider;
