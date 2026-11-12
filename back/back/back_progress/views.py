from django.shortcuts import render
from django.middleware.csrf import get_token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework.response import Response
from back.back_progress.models import User
from back.back_progress.services.serializer import UserSerializer, LoginSerializer, UpdateUserSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed, TokenError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created

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

@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def check_login(request) :
    token = request.COOKIES.get("access_token")

    if not token :
        return Response({"isLogged": False})
    
    try :
        validated_token = AccessToken(token)

        user_id = validated_token["user_id"]
        User = get_user_model()

        is_logged = User.objects.filter(pk=user_id, is_active=True).exists()

        return Response({"isLogged": is_logged})
    except (TokenError, KeyError) :
        return Response({"isLogged": False})

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

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request) :

    #On récupère les données
    email: str = request.data.get("email")
    password: str = request.data.get("password")

    #On vérifie que les champs email et password sont bien présent
    if not email or not password :
        return Response(
            {"error": "Un champs est manquant."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    #On initialise le serializer
    serializer = LoginSerializer(data={"email": email, "password": password})

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    #On identifie l'utilisateur
    user = authenticate(
         request,
         email=email,
         password=password
    )

    #Si aucun utilisateur
    if user is None :
        return Response(
            {"error" : "Email ou mot de passe incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    #On génère le token
    token = get_token_for_user(user)

    #On envoi la reponse
    response = Response(
        {
            "success": "Connexion réussie"
            
        },
        status=status.HTTP_200_OK
    )
    response.set_cookie(
        key="access_token",
        value=token["access"],
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=300,
    )
    response.set_cookie(
        key="refresh_token",
        value=token["refresh"],
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=300
    )

    return response

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request) :

    #On récupère le refresh_token dans la requête
    refresh_token = request.COOKIES.get("refresh_token")

    #Si aucun refresh_token est présent on envoi un message d'erreur
    if refresh_token :
        try :
            token = RefreshToken(refresh_token)
            token.blacklist()

        except TokenError :
            pass

        #On envoi la réponse
        response = Response(
            {
                "message" : "Déconnexion réussie"
            },
            status=status.HTTP_200_OK
        )
        #On les supprime aussi dans le navigateur
        response.delete_cookie("access_token", path="/")
        response.delete_cookie("refresh_token", path="/")

        return response

    



@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs) :

    context = {
        'current_user': reset_password_token.user,
        'username' : reset_password_token.user.username,
        'email' : reset_password_token.user.email,
        'reset_password_url': (
            f"http://localhost:8080/reset_password"
            f"?token={reset_password_token.key}"
        )
    }

    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        "Password Reset for {title}".format(title="Some website title"),
        #Message
        email_plaintext_message,
        #From
        "noreply@somehost.local",
        #to:
        [reset_password_token.user.email]
    )

    msg.attach_alternative(email_html_message, "text/html")
    msg.send()

#View pour récupérer les informations de l'utilisateur
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request) :
    #on récupère l'utilisateur depuis la requête
    user = request.user
    #Si aucun user on renvoi un message d'erreur
    if not user :
        return Response(
            {
                "error" : "Impossible de récupérer les données utilisateurs"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    #Si on trouve le user on renvoi la reponse
    return Response({
        "id": user.id,
        "username": user.username,
        "last_name": user.last_name,
        "email": user.email
    })

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request) :

    #On initialise le serializer
    serializer = UpdateUserSerializer(request.user, data=request.data, partial=True)

    #Si le serializer n'est pas valide on renvoi un message d'erreur
    if not serializer.is_valid() :
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try : 
        serializer.save()

        return Response(
            {
                "success" : "Données modifier avec succès."
            },
            status=status.HTTP_200_OK
        )
    except Exception as e :
        return Response(
            {
                "error" : "Erreur lors de la modification: {e}"
            },
            status=status.HTTP_400_BAD_REQUEST
        )







