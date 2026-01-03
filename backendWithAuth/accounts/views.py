from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .authentication import CookieJWTAuthentication
from .serializers import RegisterSerializer, UserSerializer


def _set_auth_cookies(response, refresh: RefreshToken):
    """Attach access/refresh JWTs to HttpOnly cookies."""
    access_token = refresh.access_token
    secure = getattr(settings, 'COOKIE_SECURE', False)
    samesite = getattr(settings, 'COOKIE_SAMESITE', 'Lax')
    access_max_age = int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
    refresh_max_age = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())

    response.set_cookie(
        settings.ACCESS_TOKEN_COOKIE_NAME,
        str(access_token),
        max_age=access_max_age,
        httponly=True,
        secure=secure,
        samesite=samesite,
        path ='/'
    )
    response.set_cookie(
        settings.REFRESH_TOKEN_COOKIE_NAME,
        str(refresh),
        max_age=refresh_max_age,
        httponly=True,
        secure=secure,
        samesite=samesite,
        path ='/'
    )


def _clear_auth_cookies(response: Response):
    response.delete_cookie(settings.ACCESS_TOKEN_COOKIE_NAME)
    response.delete_cookie(settings.REFRESH_TOKEN_COOKIE_NAME)
    return response


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        data = {
            'user': UserSerializer(user).data,
        }
        response = Response(data, status=status.HTTP_201_CREATED)
        _set_auth_cookies(response, refresh)
        return response


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        mobile = request.data.get('mobile')
        password = request.data.get('password')
        user = authenticate(request, mobile=mobile, password=password)
        if user is not None:
            login(request, user)
            # create JWT tokens
            refresh = RefreshToken.for_user(user)
            response = Response({
                'user': UserSerializer(user).data,
            }, status=status.HTTP_200_OK)
            _set_auth_cookies(response, refresh)
            return response
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication, JWTAuthentication]

    def post(self, request):
        """Logout endpoint that blacklists a provided refresh token (if given).

        Expected request JSON: { "refresh": "<refresh_token>" }
        If a valid refresh token is provided it will be blacklisted. The session is also logged out.
        """
        refresh_token = request.data.get('refresh')
        # blacklist the token if provided
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as e:
                return Response({'detail': 'Invalid or expired refresh token.'}, status=status.HTTP_400_BAD_REQUEST)

        # if no token provided, try cookie refresh and blacklist
        if not refresh_token:
            cookie_refresh = request.COOKIES.get(settings.REFRESH_TOKEN_COOKIE_NAME)
            if cookie_refresh:
                try:
                    token = RefreshToken(cookie_refresh)
                    token.blacklist()
                except Exception:
                    pass

        # also logout session if any
        logout(request)
        response = Response({'detail': 'Logged out'})
        _clear_auth_cookies(response)
        return response


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication, JWTAuthentication]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


@method_decorator(csrf_exempt, name='dispatch')
class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        refresh_token = request.COOKIES.get(settings.REFRESH_TOKEN_COOKIE_NAME) or request.data.get('refresh')
        if not refresh_token:
            return Response({'detail': 'Refresh token missing.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access = refresh.access_token

            # If rotating refresh tokens is enabled, issue a new refresh
            if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS', False):
                refresh.blacklist()
                refresh = RefreshToken.for_user(refresh.access_token['user_id'])

            response = Response({'access': str(access)})
            _set_auth_cookies(response, refresh)
            return response
        except TokenError:
            return Response({'detail': 'Invalid or expired refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)
