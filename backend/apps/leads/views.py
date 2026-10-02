from django.shortcuts import render

from django.conf import settings
from django.core.mail import send_mail

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.main.models import Category, Comment, ContactMessage
from .serializers import (CommentSerializer,ContactMessageSerializer,)
from apps.main.serializers import CategorySerializer


class IsAdminUserRole(IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        return (
            request.user.is_authenticated
            and request.user.role in ("admin", "superuser")
        )


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ContactMessageViewSet(viewsets.GenericViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        contact = serializer.save()

        receiver = getattr(
            settings,
            "EMAIL_HOST_USER",
            settings.DEFAULT_FROM_EMAIL,
        )

        if receiver:
            send_mail(
                subject=f"GEKO contact message from {contact.full_name}",
                message=(
                    f"Name: {contact.full_name}\n"
                    f"Email: {contact.email}\n"
                    f"Phone: {contact.phone or '-'}\n\n"
                    f"Message:\n{contact.message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[receiver],
                fail_silently=True,
            )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.action == "reply":
            return [IsAdminUserRole()]

        return [AllowAny()]

    def get_queryset(self):
        queryset = Comment.objects.filter(
            is_approved=True,
            parent__isnull=True,
        )

        category_id = self.request.query_params.get("category")
        course_id = self.request.query_params.get("popular_course")

        if category_id and course_id:
            return queryset.none()

        if category_id:
            return queryset.filter(category_id=category_id)

        if course_id:
            return queryset.filter(popular_course_id=course_id)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        comment = serializer.save(
            is_approved=False,
            parent=None,
        )

        return Response(
            self.get_serializer(comment).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="reply",
    )
    def reply(self, request, pk=None):
        parent_comment = self.get_object()

        if not parent_comment.is_approved:
            return Response(
                {"detail": "You can reply only to an approved comment."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        text = request.data.get("text")

        if not text or not str(text).strip():
            return Response(
                {"text": "This field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reply = Comment.objects.create(
            full_name="GEKO",
            email=request.user.email,
            text=str(text).strip(),
            category=parent_comment.category,
            popular_course=parent_comment.popular_course,
            parent=parent_comment,
            is_approved=True,
        )

        return Response(
            self.get_serializer(reply).data,
            status=status.HTTP_201_CREATED,
        )