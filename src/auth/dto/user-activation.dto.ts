import {IsString} from 'class-validator';

export class UserActivationDto {
    @IsString()
    email: string;

    @IsString()
    activationCode: string;
}