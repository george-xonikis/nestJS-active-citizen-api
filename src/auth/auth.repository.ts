import {Repository, EntityRepository} from 'typeorm';
import {BadRequestException, ConflictException, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {User} from './user.entity';
import {AuthCredentialsDto, extractUserProfile, getActivationCode} from './dto/auth-credentials.dto';
import {JwtPayload} from './jwt/jwt-payload.interface';
import {JwtService} from '@nestjs/jwt';
import {UserRepository} from './user/user.repository';
import {sendRegistrationEmail} from './utils/send-registration-email';


@EntityRepository(User)
export class AuthRepository extends Repository<User> {

    constructor(private userRepository: UserRepository) {
        super();
    }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<{ status, user, message }> {
        const {email, password} = authCredentialsDto;

        const user = new User();
        user.email = email;
        user.username = email;
        user.isAdmin = false;
        user.activationCode = getActivationCode();
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

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

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<{ status, message }> {
        const {status, user, message} = await this.createUser(authCredentialsDto);
        const isEmailSent = await sendRegistrationEmail(user.email, user.activationCode);

        if (!isEmailSent) {
            /** If email was failed, deleted the created user instance since without the email the user cannot be activated */
            await this.userRepository.deleteUser(user.email);
            return {
                status: 500,
                message: 'Registration email was not sent'
            };
        }

        return {
            status: 201,
            message: 'User signup successfully'
        };
    }

    async signIn(authCredentialsDto: AuthCredentialsDto, jwtService: JwtService): Promise<{ accessToken: string }> {
        const user = await this.userRepository.getUser(authCredentialsDto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.isPasswordValid(authCredentialsDto.password, user.password, user.salt);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = {email: user.username, role: 'admin'};
        const accessToken = await jwtService.sign(payload);
        return {accessToken};
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

    /** Helper methods */
    public async isPasswordValid(passwordInput: string, password: string, salt: string): Promise<boolean> {
        const hash = await bcrypt.hash(passwordInput, salt);
        return hash === password;
    }

    public async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

}