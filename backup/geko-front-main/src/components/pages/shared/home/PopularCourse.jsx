import {FaExternalLinkAlt} from 'react-icons/fa'
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import { getImageUrl } from '../../../../utils/utils';

export default function PopularCourse({
                                          gridStyleTF = true,
                                          image,
                                          id,
                                          title,
                                          desc,
                                      }) {
    const nav = useNavigate()
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }
    const imageUrl = getImageUrl(image)
    return (
        <article
            className={`border-gray flex mb-8 ${gridStyleTF === true ? "none border rounded-lg  flex-col " : "py-5 sm:flex border-b"}`}>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => nav(`/courses/${id}`)}
                className={`relative bg-no-repeat bg-cover cursor-pointer ${gridStyleTF ? "w-[100%] rounded-t-lg" : "sm:w-[260px] w-full rounded-lg"}`}
                style={{
                    backgroundImage: isHovered
                        ? `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${imageUrl})`
                        : `url(${imageUrl})`,
                    backgroundSize: '100% 100%',
                    aspectRatio: '4/3'
                }}
            >
                <FaExternalLinkAlt
                    style={{
                        opacity: isHovered ? '0.8' : '0', // Hide the icon on mouse leave
                        transition: 'opacity 0.3s ease-in-out',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                    className='text-pseudo'
                />
            </div>
            <div
                className={`w-full h-[150px] ${gridStyleTF ? " items-center py-[30px] px-[20px]" : "w-full py-[30px] sm:pl-10 sm:px-0 sm:py-0 h-[100%] gap-about_info"} flex flex-col justify-center items-center`}
            >
                <p
                    className={`hover:text-primary uppercase font-bold cursor-pointer transition-colors duration-300 ${gridStyleTF ? "text-custom-15 text-primaryDark text-center" : "text-xl"} font-medium text-primaryDark font-roboto-slab`}
                    onClick={() => nav(`/courses/${id}`)}
                >
                    {title}
                </p>
                <p
                    className={`${gridStyleTF ? "items-center" : ""} transition-colors duration-300 text-custom-15 font-medium text-primaryDark font-roboto`}
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3, // Show only 3 lines
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal', // Prevent single-line wrapping
                        maxHeight: '4.5em', // Adjust based on line height for 3 lines
                    }}
                >
                    {gridStyleTF ? "" : desc}
                </p>
            </div>

        </article>
    )
}
