// src/auth/interfaces/jwt-payload.interface.ts
export interface JwtPayload {
    sub: number;       // User ID or primary identifier
    username: string;  // Username or email
    role: string;      // User role, e.g., 'admin' or 'user'
  }
  