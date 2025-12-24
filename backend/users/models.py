from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
)


class UserManager(BaseUserManager):
    def create_user(self, mobile, password=None, **extra_fields):
        if not mobile:
            raise ValueError("Mobile number is required")

        user = self.model(mobile=mobile, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.Role.ADMIN)

        return self.create_user(mobile, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="users_custom",
        blank=True,
        help_text="Groups this user belongs to.",
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="users_custom",
        blank=True,
        help_text="Specific permissions for this user.",
    )

    mobile = models.CharField(max_length=15, unique=True)
    full_name = models.CharField(max_length=100)
    grade = models.CharField(max_length=20, blank=True, null=True)

    role = models.CharField(
        max_length=10,
        choices=[
            ("STUDENT", "Student"),
            ("TEACHER", "Teacher"),
            ("ADMIN", "Admin"),
        ],
        default="STUDENT",
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "mobile"
    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return self.mobile