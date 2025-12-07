import type { User } from "./users"

export interface LoginCredentials {
    email: string
    password: string
}

export interface AuthResponse {
    user: User
}
