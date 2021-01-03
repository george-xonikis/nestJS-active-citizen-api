import {IsEmail, IsString} from 'class-validator';

export class ResetPasswordConfirmDto{
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    token: string;

    @IsString()
    newPassword: string;

    @IsString()
    passwordRepeat: string;
}