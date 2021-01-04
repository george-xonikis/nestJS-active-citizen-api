import {IsString} from 'class-validator';

export class PasswordResetConfirmDto {
    @IsString()
    email: string;

    @IsString()
    token: string;

    @IsString()
    newPassword: string;

    @IsString()
    passwordRepeat: string;
}