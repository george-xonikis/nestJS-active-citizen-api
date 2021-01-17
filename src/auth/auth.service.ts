import {BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {AuthCredentialsDto} from './dto/auth-credentials.dto';
import {AuthRepository} from './auth.repository';
import {UserActivationDto} from './dto/user-activation.dto';
import {Base64} from 'js-base64';
import * as bcrypt from 'bcryptjs';
import {sendPasswordResetEmail} from './utils/send-password-reset-email';
import * as config from 'config';
import {PasswordResetDto} from './dto/password-reset.dto';
import {PasswordResetConfirmDto} from './dto/password-reset-confirm.dto';
import {sendRegistrationEmail} from './utils/send-registration-email';
import {UserRepository} from '../user/user.repository';
import {extractUserProfile} from '../user/helper';
import {User} from '../user/user.entity';


const jwtConfig = config.get('jwt');

@Injectable()
export class AuthService {
    constructor(@InjectRepository(AuthRepository) private authRepository: AuthRepository,
                private userRepository: UserRepository,
                private jwtService: JwtService) {
    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<{ message: string }> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await this.hashPassword(authCredentialsDto.password, salt);

        const user = await this.authRepository.createUser(authCredentialsDto, hashedPassword, salt);
        const isEmailSent = await sendRegistrationEmail(user.email, user.activationCode);

        if (!isEmailSent) {
            /** If email was failed, delete the created user instance since without the email the user cannot be activated */
            await this.userRepository.deleteUser(user.email);
            throw new InternalServerErrorException(null, 'Registration email was not sent');
        }

        return {message: 'User signup successfully'};
    }

    async login(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user: Partial<User> }> {
        const user = await this.userRepository.getUser(authCredentialsDto.email);

        if (!user.active) {
            throw new UnauthorizedException('User is not activated');
        }

        const accessToken = this.generateToken(user.email);

        const isPasswordValid = await this.isPasswordValid(authCredentialsDto.password, user.password, user.salt);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {accessToken, user: extractUserProfile(user)};
    }

    async activateUser(userActivationDto: UserActivationDto): Promise<Partial<User>> {
        const decodedEmail = Base64.decode(userActivationDto.email);
        const decodedActivationCode = Base64.decode(userActivationDto.activationCode);

        return this.authRepository.activateUser(decodedEmail, decodedActivationCode);
    }

    async passwordReset(resetPasswordDto: PasswordResetDto): Promise<{ message: string }> {
        const user = await this.userRepository.getUser(resetPasswordDto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const temporaryToken = this.generateToken(resetPasswordDto.email, 60 * 60 * 24); // Expires in 24 hours

        const isEmailSent = await sendPasswordResetEmail(resetPasswordDto.email, temporaryToken);

        if (!isEmailSent) {
            throw new InternalServerErrorException(null, 'Password reset email was not sent');
        }

        return {message: 'Password reset email was sent'};
    }

    async passwordResetConfirm(passwordResetConfirmDto: PasswordResetConfirmDto): Promise<Partial<User>> {
        if (passwordResetConfirmDto.newPassword !== passwordResetConfirmDto.passwordRepeat) {
            throw new BadRequestException('Passwords do not match');
        }

        try {
            const payload = this.jwtService.verify(passwordResetConfirmDto.token);
            const email = payload.email;

            if (email === Base64.decode(passwordResetConfirmDto.email)) {
                const user = await this.userRepository.getUser(email);
                user.password = await this.hashPassword(passwordResetConfirmDto.newPassword, user.salt);
                await this.userRepository.saveUser(user);
                return extractUserProfile(user);
            }

        } catch (err) {
            throw new UnauthorizedException('Invalid credentials');
        }

    }

    /** Helper methods */
    public verifyToken(token: string) {
        return this.jwtService.verify(token);

    }
    public async isPasswordValid(passwordInput: string, password: string, salt: string): Promise<boolean> {
        const hash = await bcrypt.hash(passwordInput, salt);
        return hash === password;
    }

    public async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    public generateToken(email: string, expiresIn: number = jwtConfig.expiresIn): string {
        const jwtPayload = {email, role: 'Admin'};
        return this.jwtService.sign(jwtPayload, {expiresIn});
    }

}
