from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    mobile = serializers.CharField(max_length=15)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        mobile = data.get("mobile")
        password = data.get("password")

        user = authenticate(
            request=self.context.get("request"),
            mobile=mobile,
            password=password
        )

        if not user:
            raise serializers.ValidationError("Invalid mobile number or password")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")

        data["user"] = user
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = (
            "full_name",
            "mobile",
            "grade",
            "role",
            "password",
        )

    def validate(self, data):
        role = data.get("role")
        grade = data.get("grade")

        if role == User.Role.STUDENT and not grade:
            raise serializers.ValidationError({
                "grade": "Grade is required for students"
            })

        if role == User.Role.TEACHER and grade:
            raise serializers.ValidationError({
                "grade": "Teachers should not have a grade"
            })

        return data

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user
