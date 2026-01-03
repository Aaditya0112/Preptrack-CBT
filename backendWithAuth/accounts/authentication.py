from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    """JWT auth that also accepts an access token stored in an HttpOnly cookie."""

    def authenticate(self, request):
        # Prefer the Authorization header when present.
        
        header = self.get_header(request)
        if header:
            raw_token = self.get_raw_token(header)
            if raw_token:
                validated_token = self.get_validated_token(raw_token)
                return self.get_user(validated_token), validated_token

        # Fallback to cookie-based token for browser clients.
        cookie_name = getattr(settings, "ACCESS_TOKEN_COOKIE_NAME", "access")
        raw_token = request.COOKIES.get(cookie_name)
        if not raw_token:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
