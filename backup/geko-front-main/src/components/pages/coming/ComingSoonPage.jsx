import React from 'react';
import './ComingSoonPage.css';

const ComingSoonPage = () => {
    return (
        <div className="coming-soon-page flex justify-center items-center text-center">
            <p className="font-bold font-roboto-slab text-3xl text-black">
                Sorry, We are down for <span className="text-primary">Maintenance</span>
            </p>
            <p className="text-color99">We're currently under maintenance, if all goas as planned we'll be back in</p>
            <img className="sm:h-[70%] h-auto" src={process.env.PUBLIC_URL + 'engineer.jpg'} alt=""/>
        </div>
    );
};

export default ComingSoonPage;
