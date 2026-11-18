from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser) :
    username = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=250, unique=True)


    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]


class Project(models.Model) :
    """
    Représente un projet avec son nom et rattacher a un utilisateur
    """
    PROJECT_TYPES = [
        ("web", "Développement web"),
        ("video", "Montage vidéo"),
        ("music", "Création musicale"),
        ("design", "Design graphique"),
        ("other", "Autre"),
    ]
    title = models.CharField(max_length=150)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects")
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPES, default="other")

class Objective(models.Model) :
    """
    Représente un objectif appartenant à un projet.

    Un projet peut avoir plusieurs objectifs.
    """
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="objectives"
    )
    title = models.CharField(max_length=200)
    is_completed = models.BooleanField(default=False)



