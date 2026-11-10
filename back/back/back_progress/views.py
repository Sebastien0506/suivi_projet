from django.shortcuts import render
from django.middleware.csrf import get_token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework.response import Response
from back.back_progress.services.serializer import UserSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
#On crée le jeton csrf
@ensure_csrf_cookie
def get_csrf(request) :
    return JsonResponse({"token": get_token(request)})

def get_token_for_user(user) :
    #On vérifie ue l'utilisateur est actif
    if not user.is_active :
        raise AuthenticationFailed("Utilisateur non connecté")
    
    #On génère le token
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access' : str(refresh.access_token)
    }

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request) :

    #On récupère les données utilisateur
    username: str = request.data.get("username")
    last_name: str =request.data.get("last_name")
    email: str = request.data.get("email")
    password: str = request.data.get("password")

    #On vérifie que tous les champs sont présent
    if not username or not last_name or not email or not password :
        return Response(
            {
               "error" : "Un champs est manquant"
            }
        )
    
    #On initialise le serializer
    serializer = UserSerializer(data={
        "username": username,
        "last_name": last_name,
        "email": email,
        "password": password
    })
    #On vérifie que le serializer est valide
    if serializer.is_valid() :
        #Si il est valide on le sauvegarde
        user = serializer.save()

        #On appel la fonction pour générer le token
        tokens = get_token_for_user(user)

        response = Response(
            {"success" : "Utilisateur crée avec succès."},
            status=status.HTTP_201_CREATED
        )

        #On met dans les cookie le jwt
        response.set_cookie(
            key="access_token",
            value=tokens["access"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=300
        )
        response.set_cookie(
            key="refresh_token",
            value=tokens["refresh"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=300
        )
        return response
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )



