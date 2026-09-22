from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

from .views import ReviewViewSet, EventViewSet, CategoryViewSet, PopularCourseViewSet, \
    LessonInfoViewSet, update_category_order, courses_by_category, events_one, TeamViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'popular_courses',
                PopularCourseViewSet, basename='popularcourse')
router.register(r'lesson_info', LessonInfoViewSet, basename='lessoninfo')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'events', EventViewSet, basename='event')
router.register(r'teams', TeamViewSet, basename='team')
urlpatterns = [
    path('', include(router.urls)),
    path('courses/<int:category_id>/', courses_by_category, name='courses_by_category'),
    path('events/<int:events_id>/', events_one, name='events_one'),
    path('update-order/', update_category_order, name='update-order'),
    path('contact/', views.ContactFormView.as_view(), name='contact_form'),
]
