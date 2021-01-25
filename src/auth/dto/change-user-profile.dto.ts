import {IsIn, IsNumber, IsOptional, IsString} from 'class-validator';

export class ChangeUserProfileDto {
    @IsString()
    @IsOptional()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsNumber()
    @IsOptional()
    age: number;

    @IsString()
    @IsOptional()
    bio: string;

    @IsString()
    @IsOptional()
    location: string;

    @IsIn(['Male', 'Female'])
    @IsOptional()
    sex: string;

    @IsString()
    @IsOptional()
    phone: string;
}
