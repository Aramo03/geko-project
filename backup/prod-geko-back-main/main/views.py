from django.conf import settings
from django.core.mail import BadHeaderError, send_mail
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.http import HttpResponse
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view

from .serializers import ContactMessageSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Event, Category, PopularCourse, Review, LessonInfo, Team, ContactMessage
from .serializers import EventSerializer, CategorySerializer, PopularCourseSerializer, ReviewSerializer, \
    LessonInfoSerializer, TeamSerializer

import environ

env = environ.Env()
environ.Env.read_env(settings.BASE_DIR / '.env')

@api_view(['GET'])
def courses_by_category(request, category_id):
    language_code = request.query_params.get('language', 'en')
    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    courses = PopularCourse.objects.filter(category=category)
    serializer = PopularCourseSerializer(courses, many=True, context={'language_code': language_code})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def events_one(request, events_id):
    language_code = request.query_params.get('language', 'en')  # Получаем язык, по умолчанию 'en'

    try:
        # Находим категорию по ID
        event = Event.objects.get(id=events_id)
    except Event.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = EventSerializer(event, many=True, context={'language_code': language_code})
    return Response(serializer.data, status=status.HTTP_200_OK)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language_code'] = self.request.query_params.get('language',
                                                                 'en')
        return context

    @action(detail=False, methods=['post'])
    def update_order(self, request):
        order_data = request.data.get('order', [])
        for index, item_id in enumerate(order_data):
            Category.objects.filter(id=item_id).update(order=index)
        return Response({'status': 'order updated'})



@csrf_exempt
@require_POST
def update_category_order(request):
    import json
    data = json.loads(request.body)
    order = data.get('order', [])

    for index, category_id in enumerate(order):
        try:
            category = Category.objects.get(id=category_id)
            category.order = index
            category.save()
        except Category.DoesNotExist:
            return JsonResponse({'error': 'Invalid category id'}, status=400)

    return JsonResponse({'status': 'order updated'})


class PopularCourseViewSet(viewsets.ModelViewSet):
    queryset = PopularCourse.objects.all()
    serializer_class = PopularCourseSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language_code'] = self.request.query_params.get('language',
                                                                 'en')
        return context


class LessonInfoViewSet(viewsets.ModelViewSet):
    queryset = LessonInfo.objects.all()
    serializer_class = LessonInfoSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language_code'] = self.request.query_params.get('language',
                                                                 'en')
        return context

    @action(detail=False, methods=['post'])
    def update_order(self, request):
        order_data = request.data.get('order', [])
        for index, item_id in enumerate(order_data):
            Category.objects.filter(id=item_id).update(order=index)
        return Response({'status': 'order updated'})


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language_code'] = self.request.query_params.get('language',
                                                                 'en')
        return context


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language_code'] = self.request.query_params.get('language',
                                                                 'en')
        return context


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language_code'] = self.request.query_params.get('language',
                                                                 'en')
        return context


# def reset_database(request):
#     with connection.cursor() as cursor:
#         cursor.execute("DROP SCHEMA public CASCADE;")
#         cursor.execute("CREATE SCHEMA public;")
#     return HttpResponse("Database reset successfully.")


class ContactFormView(APIView):
    serializer_class = ContactMessageSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            # Extract all validated data
            full_name = serializer.validated_data['full_name']
            email = serializer.validated_data['email']
            message = serializer.validated_data['message']
            country = serializer.validated_data['country']
            whatsapp = serializer.validated_data['whatsapp']
            category = serializer.validated_data['category']

            # Save the message to the database
            ContactMessage.objects.create(
                full_name=full_name,
                email=email,
                message=message,
                country=country,
                whatsapp=whatsapp,
                category=category
            )

            try:
                # Compose email content for the admin
                admin_email_content = (
                    f"Name: {full_name}\n"
                    f"Email: {email}\n"
                    f"Message: {message}\n"
                    f"Country: {country}\n"
                    f"WhatsApp: {whatsapp}\n"
                    f"Category: {category if category else 'N/A'}"
                )

                # Send email to the admin
                send_mail(
                    'New Contact Message',
                    admin_email_content,
                    env('EMAIL_HOST_USER'),  # Sender email (adjust to your actual email)
                    ['gekoeducation@gmail.com'],  # Recipient email
                    fail_silently=False
                )

                # Compose confirmation email content for the user
                user_email_content = (
                    f"Hello {full_name},\n\n"
                    "Thank you for contacting us! We have received your message and will get back to you soon.\n\n"
                    f"Your message:\n{message}\n\n"
                    "Best regards,\nGeko Education"
                )

                # Send confirmation email to the user
                send_mail(
                    'Thank you for contacting us!',
                    user_email_content,
                    env('EMAIL_HOST_USER'),  # Sender email (adjust to your actual email)
                    [email],  # Send it to the user's email
                    fail_silently=False
                )

                return Response({'message': 'Email sent successfully and message saved!'}, status=200)

            except BadHeaderError:
                return Response({'error': 'Invalid header found in the email.'}, status=400)
            except Exception as e:
                return Response({'error': f'An error occurred while sending the email: {str(e)}'}, status=500)

        # If serializer is not valid, return errors
        return Response(serializer.errors, status=400)



