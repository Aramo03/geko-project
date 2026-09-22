import React from 'react'
import {useTranslation} from "react-i18next";

export default function AboutCard2({title, desc, image}) {
    const {t} = useTranslation();
    return (
        <article
            className="relative my-5 gap-3  min-h-[200px] bg-none text-center overflow-hidden flex flex-col justify-center items-start">
            <img src={image} alt="article" className='aspect-video w-full object-cover h-full'/>
            <h1 className="text-xl text-center font-roboto-slab font-bold text-primaryDark w-full">
                {t(title)}
            </h1>
            <p className="text-md text-secondaryLight px-[10px]">{t(desc)}</p>
        </article>
    )
}
