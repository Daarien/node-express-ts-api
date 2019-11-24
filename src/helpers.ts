export function checkUserCredentials(
  login: string,
  password: string
): string | null {
  if (login && typeof login === "string") {
    if (!RegExp(/[a-zA-z]+/).test(login)) {
      return "Login format is not acceptable";
    }
    if (login.length < 4) {
      return "Login is too short";
    }
    if (login.length > 8) {
      return "Login is too long";
    }
  } else {
    return "Login is not present in signup request";
  }

  if (password && typeof password === "string") {
    if (password.length < 4 || password.length > 16) {
      return "Password must be 4-16 chars length";
    }
  } else {
    return "Password is not present in signup request";
  }

  return null;
}
