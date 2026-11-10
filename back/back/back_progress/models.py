from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser) :
    username = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=250, unique=True)


    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
