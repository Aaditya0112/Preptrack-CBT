from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('mobile', 'full_name', 'role', 'is_staff', 'is_superuser')
    search_fields = ('mobile', 'full_name')
    ordering = ('mobile',)

    fieldsets = (
        (None, {'fields': ('mobile', 'password')}),
        ('Personal info', {'fields': ('full_name', 'grade', 'profilePic')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'role', 'groups', 'user_permissions')}),
    )
