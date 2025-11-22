/**
 * Request payload for user login
 */
export type LoginRequest = {
  username?: string;
  email?: string;
  password: string;
}

/**
 * Request payload for user registration
 */
export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
}

/**
 * Response from a successful login request
 */
export type LoginResponse = {
  expiresIn: number;
  message: string;
}

/**
 * User profile information returned from the /me endpoint
 */
export type UserProfile = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  givenName?: string;
  familyName?: string;
}
