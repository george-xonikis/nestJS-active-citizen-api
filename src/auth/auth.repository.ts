import {Repository, EntityRepository} from 'typeorm';
import {BadRequestException, ConflictException, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {AuthCredentialsDto, extractUserProfile, getActivationCode} from './dto/auth-credentials.dto';
import {UserRepository} from './user/user.repository';
import {sendRegistrationEmail} from './utils/send-registration-email';
import {User} from './user/user.entity';


@EntityRepository(User)
export class AuthRepository extends Repository<User> {

    constructor(private userRepository: UserRepository) {
        super();
    }

    async createUser(authCredentialsDto: AuthCredentialsDto, hashedPassword: string, salt: string): Promise<{ status, user, message }> {
        const {email, password} = authCredentialsDto;

        const user = new User();
        user.email = email;
        user.username = email;
        user.isAdmin = false;
        user.activationCode = getActivationCode();
        user.salt = salt;
        user.password = hashedPassword;

        try {
            await user.save();

            return {
                status: 201,
                user: user,
                message: 'User created successfully'
            };
        } catch (error) {
            if (error.code === '23505') { // duplicated email
                throw new ConflictException('Email already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signUp(authCredentialsDto: AuthCredentialsDto, hashedPassword: string, salt: string): Promise<string> {
        const {status, user, message} = await this.createUser(authCredentialsDto, hashedPassword, salt);
        const isEmailSent = await sendRegistrationEmail(user.email, user.activationCode);

        if (!isEmailSent) {
            /** If email was failed, delete the created user instance since without the email the user cannot be activated */
            await this.userRepository.deleteUser(user.email);
            throw new InternalServerErrorException(null, 'Registration email was not sent');
        }

        return 'User signup successfully';
    }

    async login(user: User, isPasswordValid: boolean, accessToken: string): Promise<{ accessToken: string, user: Partial<User> }> {
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {accessToken, user: extractUserProfile(user)};
    }

    async activateUser(email: string, activationCode: string): Promise<Partial<User>> {
        const user = await this.userRepository.getUser(email);

        if (user.activationCode === activationCode) {
            user.active = true;
            await user.save();
            return extractUserProfile(user);
        }

        throw new BadRequestException('Invalid Email or Activation Code');
    }


}