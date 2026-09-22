import React from 'react';
import {useTranslation} from "react-i18next";

export default function ContactInfo({ value, index, Icon }) {
    const { t } = useTranslation();
    const description = t(value.description);
    const dynamicStyles = {
        border: `1px solid ${value.color}`,
        borderBottom: `4px solid ${value.color}`,
    };

    return (
        <div
            className={`flex px-5 py-10 w-full md:w-[300px] mid:aspect-square aspect-auto text-center m-4 border-gray-300 hover:border-b rounded-lg transition-all duration-300 flex-col items-center gap-4`}
            style={dynamicStyles}
        >
            <Icon className={`text-4xl`} style={{ color: value.color }} />
            <b className="text-bold text-xl">{t(value.title)}</b>
            <div className="text-color60 text-custom-15 text-center">
                {/* Using <div> or <span> instead of <p> */}
                {description.split('\n').map((line, index) => (
                    <div key={index}>{line}</div> // Replace <p> with <div>
                ))}
            </div>
        </div>
    );
}
