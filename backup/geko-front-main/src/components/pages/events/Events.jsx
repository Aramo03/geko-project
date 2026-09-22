import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Event from '../shared/event/Event';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvents } from '../../../redux/dataSlice';

export default function Events() {
    const { t, i18n } = useTranslation();
    const { tab } = useParams(); // Get the active tab from the URL
    const navigate = useNavigate(); // To update the URL when changing the tab
    const events = useSelector(state => state.data.events);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch, i18n.language]);

    const tabs = [
        { title: 'happening', id: 1 },
        { title: 'upcoming', id: 2 },
        { title: 'completed', id: 3 },
    ];

    // Фильтрация событий по вкладкам
    const tabCounts = {
        happening: events?.filter((e) => e.status === 'happening').length || 0,
        upcoming: events?.filter((e) => e.status === 'upcoming').length || 0,
        completed: events?.filter((e) => e.status === 'completed').length || 0,
    };

    // Set activeTab based on the tab in the URL or default to 'completed'
    const [activeTab, setActiveTab] = useState(tab || 'completed');
    // Update the URL when the activeTab changes
    useEffect(() => {
        // Only update the URL if the active tab changes and is different from the current tab in the URL
        if (tab !== activeTab) {
            navigate(`/events/${activeTab}`, { replace: true });
        }
    }, [activeTab, tab, navigate]);
    
    return (
        <main className="lg:px-20 px-5 center:max-w-[1300px] max-w-full mx-auto py-20 flex flex-col">
            <h1 className="text-3xl font-roboto-slab font-bold text-primaryDark">
                {t('EVENTS')}
            </h1>
            <div className="flex justify-center mb-4 border-b w-full flex-wrap">
                {tabs.map((tabItem) => {
                    const isDisabled = tabCounts[tabItem.title] === 0; // Если событий нет
                    return (
                        <button
                            key={tabItem.id}
                            disabled={isDisabled} // Отключение кнопки, если пусто
                            className={`${activeTab === tabItem.title
                                ? 'border-b-2 border-primary text-primary'
                                : isDisabled
                                    ? 'text-gray-300 cursor-not-allowed' // Стили для неактивных вкладок
                                    : 'text-gray-500'
                                } focus:outline-none font-roboto-slab font-bold text-xl mx-10 pb-2 capitalize`}
                            onClick={() => !isDisabled && setActiveTab(tabItem.title)} // Избегаем переключения на отключенную вкладку
                        >
                            {t(tabItem.title)}
                        </button>
                    );
                })}
            </div>
            {events?.map((pickedEvent) => {
                return (
                    pickedEvent.status === activeTab && (
                        <Event key={pickedEvent.id} pickedEvent={pickedEvent} />
                    )
                );
            })}
        </main>
    );
}
