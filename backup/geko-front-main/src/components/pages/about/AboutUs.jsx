import aboutcard2info from '../../../entities/aboutcard2info'
import AboutCard2 from '../shared/about/AboutCard2'
import { BiSolidQuoteLeft } from 'react-icons/bi'
import { useTranslation } from 'react-i18next';
import Course from "../shared/home/Course";
import Team from "../shared/home/Team";
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

export default function AboutUs() {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);

    const handleImageLoad = () => {
        setLoaded(true);
    };

    return (<main>
        <section>
            <div className="px-5 max-w-[1200px] mx-[auto] flex flex-col gap-[10px]">
                <h1 className="text-3xl py-4 font-roboto-slab font-bold text-primaryDark">
                    {t('ABOUT_US')}
                </h1>
                <div className='w-full flex justify-center'>
                    {!loaded && <Skeleton width={600} height={500} />}
                    <img onLoad={handleImageLoad} src={'/images/mer_masin.webp'} className={`w-[600px] ${!loaded ? "hidden" : "block"}`} alt="" />
                </div>
                <div className="py-2">
                    <p className="text-md text-primaryDark text-justify">
                        {t('learn_with_passion_desc')}
                    </p>
                </div>
            </div>
            <Course />
        </section>
        <section className="text-center bg-primaryLight w-full px-5 ">
            <div className="max-w-[1200px] mx-[auto]">
                <div className="pt-5">
                    <h1 className="text-3xl py-2 font-roboto-slab font-bold text-primaryDark">
                        {t('What_Make_Us_Spcecial')}
                    </h1>
                </div>
                <div className="grid mid:grid-cols-3 grid-cols-1 grid-rows-1 items-start gap-[15px] my-10 ">
                    {aboutcard2info.map(({ id, desc, title, image }) => {
                        return (<AboutCard2 key={id} title={title} desc={desc} image={image} />)
                    })}
                </div>
            </div>
        </section>
        <section
            className="my-16 gap-8 px-5 w-[100%] sm:w-full flex items-start justify-center">
            <BiSolidQuoteLeft className="w-[40px] h-[40px]  text-primary" />
            <p className=" py-2 font-roboto-slab font-bold text-primaryDark flex flex-col mid:w-[50%] w-[100%] sm:text-2xl text-xl">
                {t('PS')}
                <span className="text-sm pt-5 font-normal text-primaryDark">
                    {t('Nelson_Mandela')}
                </span>
            </p>
        </section>
        <div className='flex flex-col justify-center'>
            <div className="text-center lg:px-20 px-5 py-2 ">
                <h1 className="text-3xl py-2 font-roboto-slab font-bold text-primaryDark">
                    {t('TEAM')}
                </h1>
                <p className="text-md text-primaryDark">
                    {t('TEAM_DESC')}
                </p>
            </div>
            <div className="text-start lg:px-20 px-5 pt-5 min-h-[380px]">
                <Team />
            </div>
        </div>
    </main>)
}
