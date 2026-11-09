from django.shortcuts import render
from django.middleware.csrf import get_token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

#On crée le jeton csrf
@ensure_csrf_cookie
def get_csrf(request) :
    return JsonResponse({"token": get_token(request)})


