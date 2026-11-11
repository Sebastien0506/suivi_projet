from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import PermissionDenied
from rest_framework.authentication import CSRFCheck

class CookieJWTAuthentication(JWTAuthentication) :
    def authenticate(self, request):
        #On récupère le token
        token = request.COOKIES.get("access_token")

        if not token :
            return None
        
        validated_token = self.get_validated_token(token)

        user = self.get_user(validated_token)

        self.enforce_csrf(request)

        return user, validated_token
    
    def enforce_csrf(self, request) :
        check = CSRFCheck(lambda request: None)

        check.process_request(request)

        reason = check.process_view(
            request,
            None,
            (),
            {}
        )
        if reason:
            raise PermissionDenied(
                f"CSRF failed: {reason}"
            )