import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../api/client';

const CourseCategoryList = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await client.get('/api/categories/');
        setCategories(response.data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [t]);

  // DoD 4: Loading / error / empty վիճակներ i18n-ից
  if (isLoading) return <div className="flex justify-center items-center min-h-[50vh]">{t('loading')}</div>;
  if (isError) return <div className="text-red-500 text-center">{t('error')}</div>;
  if (!categories || categories.length === 0) return <div className="text-center">{t('empty')}</div>;

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Վերնագիր ըստ Figma-ի */}
      <h1 className="text-3xl font-bold mb-8">{t('categories')}</h1>
      
      {/* Քարտերի ցանց */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} to={`/course-category/${category.id}`} className="block overflow-hidden rounded-lg border shadow-sm transition hover:shadow-md">
            <img 
              src={category.image_url || category.local_image} 
              alt={category.text || category.name} 
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{category.text || category.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CourseCategoryList;