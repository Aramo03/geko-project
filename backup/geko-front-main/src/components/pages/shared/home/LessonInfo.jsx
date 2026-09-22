import { getImageUrl } from '../../../../utils/utils';

export default function LessonInfo({image, title}) {

    return (
        <article
            className="hover-effect flex-container-content flex py-5 md:py-0 transition-colors duration-300 gap-2 text-white flex-col items-center justify-between shadow-2xl"
        >
            <img
                src={getImageUrl(image)}
                alt={title}  // Улучшено описание alt для доступности
                className="w-[200px] text-primary" // Добавляем класс hover-effect
            />
            <span
                className="text-lg h-[57.5px] text-center hover:text-primary w-full hover:border-primary border-b middle:border-b max:border-0">
                {title}
            </span>
        </article>
    );
}
