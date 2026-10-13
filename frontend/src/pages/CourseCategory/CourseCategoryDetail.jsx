import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../api/client';

const CourseCategoryDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [category, setCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        // Բեռնում ենք կոնկրետ կատեգորիայի տվյալները
        const resCategory = await api.get(`/api/categories/${id}/`);
        setCategory(resCategory.data);
        
        // Բեռնում ենք տվյալ կատեգորիային պատկանող դասընթացները
        const resCourses = await api.get(`/api/courses/?category=${id}`);
        setCourses(resCourses.data.results || resCourses.data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCategoryDetails();
    }
  }, [id]);

  // DoD վիճակներ (Loading, Error, Empty)
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[50vh] text-gray-600">{t('loading', 'Loading...')}</div>;
  }

  if (isError) {
    return <div className="text-red-500 text-center py-20">{t('error', 'Something went wrong. Try again later.')}</div>;
  }

  if (!category) {
    return <div className="text-center py-20 text-gray-500">{t('empty', 'Nothing to show yet.')}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f9f8]">
      <section className="bg-[#f7f9f8] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Վերնագրի հատված */}
          <div className="text-center mb-12">
            <p className="text-[#0a5c36] text-xs font-bold uppercase tracking-wider mb-2">
              {t('empowerment_curriculum', 'EMPOWERMENT CURRICULUM')}
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {category.name || t('popular_courses', 'Popular Courses')}
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              {category.description || t('courses_subtitle', 'Explore our most popular educational programs customized for logical, analytical, and digital maturity.')}
            </p>
          </div>

          {/* Քարտերի ցանց */}
          {courses.length === 0 ? (
            <div className="text-center text-gray-500 py-12">{t('empty', 'Nothing to show yet.')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col border border-gray-100">
                  
                  {/* Նկար */}
                  <div className="rounded-xl overflow-hidden mb-4 h-48 bg-gray-200">
                    <img
                      src={course.image_url || course.local_image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Պիտակ (Badge) */}
                  <div className="mb-3">
                    <span className="inline-block bg-[#e8f3ee] text-[#0a5c36] text-[10px] font-bold uppercase px-2.5 py-1 rounded-md">
                      {course.category_name || category.name || 'LANGUAGE ARTS'}
                    </span>
                  </div>

                  {/* Վերնագիր և նկարագրություն */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                    {course.desc || course.description || 'Master creative verbal clarity, public speech models, and structured international reading levels.'}
                  </p>

                  {/* Քարտի ներքևի հատված (Footer) */}
                  <div className="mt-auto flex justify-between items-end border-t border-gray-50 pt-4">
                    
                    {/* Ուսանողների քանակ և Մակարդակ */}
                    <div className="flex flex-col gap-1.5 text-[11px] text-gray-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        {/* User Icon */}
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                        <span>{course.students || '148'} Students</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/* Document/Level Icon */}
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>{course.level || 'Beginner to Advanced'}</span>
                      </div>
                    </div>
                    
                    {/* Learn More Կոճակ */}
                    <Link 
                      to={`/courses/${course.id}`} 
                      className="bg-[#0a5c36] hover:bg-[#074628] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      {t('learn_more', 'Learn More')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Բոլոր դասընթացների կոճակ */}
          <div className="mt-12 text-center">
            <Link 
              to="/courses" 
              className="inline-block bg-[#0a5c36] hover:bg-[#074628] text-white text-xs font-bold uppercase tracking-wide px-8 py-3.5 rounded-lg transition-colors shadow-sm"
            >
              {t('view_all_courses', 'VIEW ALL COURSES')}
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

export default CourseCategoryDetail;