export interface User {
    _id: string
    email: string
    name?: string
}

export interface CreateUserDto {
    email: string
    password: string
    name?: string
}

export interface UpdateUserDto {
    email?: string
    password?: string
    name?: string
}
