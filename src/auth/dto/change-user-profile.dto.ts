import {IsIn, IsNumber, IsString} from 'class-validator';

export class ChangeUserProfileDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsNumber()
    age: number;

    @IsString()
    bio: string;

    @IsString()
    location: string;

    @IsIn(['Male', 'Female'])
    sex: string;

    @IsString()
    phone: string;
}