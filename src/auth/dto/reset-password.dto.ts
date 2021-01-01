import {IsEmail, IsString} from 'class-validator';

export class ResetCredentialsDto {
    @IsString()
    @IsEmail()
    email: string;
}