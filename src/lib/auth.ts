import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || ''

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set')
}

export interface JWTPayload {
  adminId: string
  email: string
  iat?: number
  exp?: number
}

/**
 * Sign a JWT token for admin authentication
 * @param payload - The data to include in the token
 * @param expiresIn - Token expiration time (default: 24h)
 * @returns Signed JWT token
 */
export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresIn: string = '24h'): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET)

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
}

/**
 * Verify and decode a JWT token
 * @param token - The JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
