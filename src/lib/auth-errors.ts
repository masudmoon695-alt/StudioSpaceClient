interface AuthErrorLike {
  code?: string;
  message?: string;
  status?: number;
}

export function authErrorMessage(error: AuthErrorLike): string {
  switch (error.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "Email or password is incorrect. Check both fields and try again.";
    case "INVALID_EMAIL":
      return "Enter a valid email address.";
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "An account with this email already exists. Sign in instead.";
    case "PASSWORD_TOO_SHORT":
      return "Use at least 6 characters for your password.";
    case "PASSWORD_TOO_LONG":
      return "Use 128 characters or fewer for your password.";
    case "INVALID_ORIGIN":
      return "This request came from an origin the sign-in service doesn't trust. Reload the page and try again.";
    default:
      return (
        error.message?.trim() ||
        "Sign-in didn't complete. Try again in a moment."
      );
  }
}
