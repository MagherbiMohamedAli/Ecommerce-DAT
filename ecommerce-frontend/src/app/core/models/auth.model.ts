import { User } from "./user.model";

export interface AuthResponse {
    access_token: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}