import {IsString, MinLength, MaxLength, Matches, IsEmail} from 'class-validator';
import {User} from '../user/user.entity';

export class AuthCredentialsDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;
}

export const extractUserProfile = (user: User): Partial<User> => {
    delete user.salt;
    delete user.username;
    delete user.password;
    delete user.activationCode;
    return user;
};

export const getActivationCode = (): string => {
    /** Generate a random 8 digits code */
    return Math.floor(Math.random() * Math.pow(10, 8)).toString();
};
