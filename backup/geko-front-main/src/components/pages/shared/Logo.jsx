import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Logo({ size = '70px' }) {
    useEffect(() => {
        const img = new Image();
        img.src = '/images/logo.webp'; // Preload the image
    }, []);

    return (
        <Link to='/'>
            <div className="flex w-max items-center gap-2 justify-between">
                <img src={'/images/logo.webp'} width={size} height={size} alt="logo"/>
                <span className='text-4xl font-roboto-slab font-bold '>GEKO</span>
            </div>
        </Link>
    )
}
