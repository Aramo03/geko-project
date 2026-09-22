import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { postData } from "../contacts/api/fetchMessage";
import Input from "../shared/contact/Input";
import Button from "../shared/contact/Button";
import { useTranslation } from "react-i18next";
import { MdKeyboardArrowDown } from "react-icons/md";
import Notification from "../shared/contact/Notification";
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function RegisterForm({ check = true }) {
    const { t } = useTranslation();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const categories = useSelector(state => state.data.categories);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [countries, setCountries] = useState([]);

    const [showNotify, setShowNotify] = useState(false)
    const [status, setStatus] = useState(null)
    const triggerNotification = () => {
        setShowNotify(true)
        setTimeout(() => setShowNotify(false), 3000)
    }
    const onSubmit = async data => {
        try {
            const response = await postData(data, setSelectedCategory, setSelectedCountry)

            triggerNotification()
            setStatus({
                status: 'success',
                message: 'Message was sent successfully',
            })

            reset()
            console.log('Data posted successfully:', response)
        } catch (error) {
            reset()
            triggerNotification()
            setStatus({
                status: 'error',
                message: error.message,
            })
            console.error('Error occurred while posting context:', error)
        }
    }

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get(
                    'https://restcountries.com/v3.1/all?fields=name,cca3'
                );
                const countryData = response.data.map(country => ({
                    id: country.cca3,
                    name: country.name.common
                })).sort((a, b) => a.name.localeCompare(b.name));
                setCountries(countryData);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
    }, []);

    const handleCountrySelect = (id) => {
        setSelectedCountry(id);
        setIsCountryDropdownOpen(false);
    };

    const handleCategorySelect = (id) => {
        setSelectedCategory(id);
        setIsCategoryDropdownOpen(false);
    };

    const toggleCountryDropdown = () => {
        setIsCountryDropdownOpen(!isCountryDropdownOpen);
        if (!isCountryDropdownOpen) {
            setIsCategoryDropdownOpen(false);
        }
    };

    const toggleCategoryDropdown = () => {
        setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
        if (!isCategoryDropdownOpen) {
            setIsCountryDropdownOpen(false);
        }
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`w-full flex flex-col gap-5 relative bg-white p-8 rounded-lg z-10 ${check ? "shadow-lg max-w-md" : ''}`}
            >
                {check ? <div
                    className="absolute w-[140%] max-h-full top-[-80%] left-[-20%] inset-0 bg-primary z-20 rounded-full"></div> : ''}
                <h2 className={`text-center text-2xl font-bold uppercase z-20 font-roboto-slab ${check ? "text-white" : 'text-primaryDark'}`}>
                    {t('free_trail')}
                </h2>
                <div className="space-y-4">
                    <Input
                        placeholder={t("fullName")}
                        name="full_name"
                        {...register("full_name", { required: t("fullName is required") })}
                        error={errors.full_name?.message}
                    />
                    <div className="mb-4 relative">
                        <button
                            type="button"
                            onClick={toggleCountryDropdown}
                            className="capitalize w-full flex justify-between items-center pl-5 py-2 border border-gray-300 rounded-lg text-primaryDark"
                        >
                            <p>
                                {selectedCountry ? countries.find(country => country.id === selectedCountry)?.name : t("country")}
                            </p>
                            <MdKeyboardArrowDown className='text-[18px]' />
                        </button>

                        {isCountryDropdownOpen && (
                            <ul className="absolute w-full bg-white border border-gray-300 rounded-lg mt-[1px] max-h-48 overflow-y-auto z-10">
                                {countries.map((country) => (
                                    <li
                                        key={country.id}
                                        onClick={() => handleCountrySelect(country.id)}
                                        className={`p-3 cursor-pointer hover:bg-gray-200 capitalize ${selectedCountry === country.id ? 'bg-gray-300' : ''}`}
                                    >
                                        {country.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {errors.country && <p className="text-red-500 text-sm mt-1">{t(errors.country.message)}</p>}

                    <div className="mb-4 relative">
                        <button
                            type="button"
                            onClick={toggleCategoryDropdown}
                            className="capitalize w-full flex justify-between items-center pl-5 py-2 border border-gray-300 rounded-lg text-primaryDark"
                        >
                            <p>
                                {selectedCategory ? categories.find(cat => cat.id === selectedCategory)?.translation?.text : t("Category")}
                            </p>
                            <MdKeyboardArrowDown className='text-[18px]' />
                        </button>

                        {isCategoryDropdownOpen && (
                            <ul className="absolute w-full bg-white border border-gray-300 rounded-lg mt-[1px] max-h-48 overflow-y-auto z-10">
                                {categories.map((category) => (
                                    <li
                                        key={category.id}
                                        onClick={() => handleCategorySelect(category.id)}
                                        className={`p-3 cursor-pointer hover:bg-gray-200 capitalize ${selectedCategory === category.id ? 'bg-gray-300' : ''}`}
                                    >
                                        {category.translation?.text}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{t(errors.category.message)}</p>}

                    <Input
                        placeholder={t("WhatsApp_Number")}
                        type="tel"
                        name="whatsapp"
                        {...register("whatsapp", {
                            required: t("WhatsApp number is required"),
                            pattern: { value: /^\+?\d+$/, message: t("Please enter a valid phone number") },
                        })}
                        error={errors.whatsapp?.message}
                    />

                    <Input
                        placeholder={t("Email")}
                        type="email"
                        name="email"
                        {...register("email", { required: t("Email is required") })}
                        error={errors.email?.message}
                    />

                    <Input
                        placeholder={t("Message")}
                        name="message"
                        {...register("message", { required: t("Message is required") })}
                        error={errors.message?.message}
                    />

                    <Button type="submit" text={t("confirm")} />
                </div>
            </form>
            {showNotify && (
                <Notification status={status.status} message={status.message} />
            )}
        </div>
    );
}
