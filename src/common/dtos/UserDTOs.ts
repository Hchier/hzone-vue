export type UserLoginDTO = {
    username: string,
    password: string
}

export type UserRegisterDTO = {
    username: string,
    password: string,
    repeatedPassword: string,
    email: string,
    authCode: string,
}

export type ResetPasswordDTO = {
    password: string,
    repeatedPassword: string,
    authCode: string,
    email: string,
}