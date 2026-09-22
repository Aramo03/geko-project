export const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://127.0.0.1:8000';

export const findById = (array, id) => {
    if (!Array.isArray(array)) return null;
    const parsedId = parseInt(id, 10);
    return array.find(item => item.id === parsedId);
};

export const filterByProperty = (array, property, value) => {
    if (!Array.isArray(array)) return [];
    return array.filter(item => item[property] === value);
};

export const getImageUrl = (image, baseUrl = BASE_URL) => {
    if (image && typeof image === 'string') {
        return image.startsWith('https') ? image : `${baseUrl}${image}`;
    }
    return 'https://eduma.thimpress.com/wp-content/uploads/2022/07/thumnail-cate-7-170x170.png';
};

export const renderBullet = (index, className) => {
    return `<span class="${className}" style="background-color: #FFB606;"></span>`;
}; 