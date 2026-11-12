from rest_framework import serializers
from back.back_progress.models import User
import html
class UserSerializer(serializers.ModelSerializer) :
    class Meta :
        model = User
        fields = ['id', 'username', 'last_name', 'email', 'password']

    
    #On déclare la fonction qui nettoie les données
    def clean_input(self, value) :
        return html.escape(value)
    
    #On valide le nom
    def validate_username(self, value) :
        cleaned_input = self.clean_input(value)

        if not all(char.isalpha() or char == "-" for char in cleaned_input) :
            raise serializers.ValidationError("Le nom d'utilisateur contient des caractères non autorisé.")
        
        return cleaned_input
    
    def validate_last_name(self, value) :
        cleaned_input = self.clean_input(value)

        if not all(char.isalpha() or char in ["-", " "] for char in cleaned_input) :
            raise serializers.ValidationError("Le Prénom contient des caractères non autorisé.")
        return cleaned_input
    
    def validate_email(self, value) :
        cleaned_input = self.clean_input(value)

        #On vérifie que le champs comporte un @ et un point
        if cleaned_input.count("@") != 1 or "." not in cleaned_input :
            raise serializers.ValidationError("Adresse email invalide")
        
        #On récuère le nom de domain de l'email
        domain = cleaned_input.split("@")[1]

        #On établi une liste des noms de dommaine accepter
        if domain.count(".") != 1 :
            raise serializers.ValidationError("Le nom de domaine de l'email est invalide.")
        
        if not all(char.isalnum() or char in ["@", ".", "-", "_"] for char in cleaned_input) :
            raise serializers.ValidationError("L'email contient des caractères non autorisé.")
        
        return cleaned_input
    
    def validate_password(self, value) :

        #On établie une liste des caractères spéciaux autorisé.
        special_char = {"@", "$", "!", "%", "*", "?", "&", "#", "_", "-"}

        #on vérifie que le mot de passe contient au moins 8 caractères.
        if len(value) < 8 :
            raise serializers.ValidationError("Le mot de passe doit contenir au moins 8 caractères.")
        #On vérifie que le mot de passe contient au moins une majuscule
        if not any(char.isupper() for char in value) :
            raise serializers.ValidationError("Le mot de passe doit contenir au moins une majuscule.")
        
        #On vérifie que le mot de passe contient au moins une minuscule
        if not any(char.islower() for char in value) :
            raise serializers.ValidationError("Le mot de passe doit contenir au moins une lettre minuscule.")
        
        #On vérifie que le mot de passe contient au moins un chiffre
        if not any(char.isdigit() for char in value) :
            raise serializers.ValidationError("Le mot de passe doit contenir au moins un chiffre.")
        
        #On vérifie que le mot de passe contient au moins un caractère spécial
        if not any(char in special_char for char in value) :
            raise serializers.ValidationError("Le mot de passe doit contenir au moins un caractères spécial (@, $, !, %, ?, &)")
        
        #On vérifie que le mot de passe ne contient pas de caractères non autorisé.
        if not all(char.isalnum() or char in special_char for char in value) :
            raise serializers.ValidationError("Le mot de passe contient des caractères spéciaux non autorisés.")
        
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class LoginSerializer(serializers.Serializer) :
    
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    
    
    def validate_email(self, value) :
        return
    
    def validate_password(self, value) :
        if not value:
            raise serializers.ValidationError(
                "Le mot de passe est obligatoire."
            )
        return value
        
class UpdateUserSerializer(serializers.ModelSerializer) :
    class Meta:
        model = User
        fields = ["username", "last_name", "email"]

    def validate_username(self, value) :
        #On vérifie que le username ne contient pas de caractères non autorisée
        if not all(char.isalpha() or char in ["-", " "] for char in value) :
            raise serializers.ValidationError("Le champs 'Nom' contient des caractères non autorisée")
        
        return value
    
    def validate_last_name(self, value) :
        #On vérifie que le champ lastname ne contien tpas des caratères non autorisée
        if not all(char.isalpha() or char in ["-", " "] for char in value) :
            raise serializers.ValidationError("Le champ 'Prénom' contient des caractère non autorisée")
        
        return value

    def validate_email(self, value) :
        #On récupère la chaine de caractères avant le arobase
        beforarobase = value.split("@")[0]

        #On vérifie que la chaine avant le arobase ne contient pas de caractères interdit
        if not all(char.isalnum() or char in [".", "-", "_"] for char in beforarobase) :
            raise serializers.ValidationError("La chaine avant le arobase contient des caractères non autorisée")
        
        #On récupère la chaine de caractères apres le arobase
        afterarobase = value.split("@")[1]

        if not all(char.isalnum() or char in [".", "-", "_"] for char in afterarobase): 
            raise serializers.ValidationError("La chaine apres le arobase contient des caractères non autorisée")
        
        return value
    
    
    


        