import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {AuthCredentialsDto} from './dto/auth-credentials.dto';
import {AuthRepository} from './auth.repository';
import {UserActivationDto} from './dto/user-activation.dto';
import {Base64} from 'js-base64';
import {User} from './user/user.entity';
import * as bcrypt from 'bcryptjs';
import {UserRepository} from './user/user.repository';
import {sendPasswordResetEmail} from './utils/send-password-reset-email';
import * as config from 'config';
import {ResetCredentialsDto} from './dto/reset-password.dto';

const jwtConfig = config.get('jwt');

@Injectable()
export class AuthService {
    constructor(@InjectRepository(AuthRepository) private authRepository: AuthRepository,
                private userRepository: UserRepository,
                private jwtService: JwtService) {
    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await this.hashPassword(authCredentialsDto.password, salt);
        return await this.authRepository.signUp(authCredentialsDto, hashedPassword, salt);
    }

    async login(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user: Partial<User> }> {
        const _user = await this.userRepository.getUser(authCredentialsDto.email);

        const _accessToken = this.generateToken(_user.email);
        const isPasswordValid = await this.isPasswordValid(authCredentialsDto.password, _user.password, _user.salt);
        const {user, accessToken} = await this.authRepository.login(_user, isPasswordValid, _accessToken);

        return {accessToken, user};
    }

    async activateUser(userActivationDto: UserActivationDto): Promise<Partial<User>> {
        const decodedEmail = Base64.decode(userActivationDto.email);
        const decodedActivationCode = Base64.decode(userActivationDto.activationCode);
        return this.authRepository.activateUser(decodedEmail, decodedActivationCode);
    }

    async resetPassword(resetCredentialsDto: ResetCredentialsDto): Promise<void> {
        await this.userRepository.getUser(resetCredentialsDto.email);

        const temporaryToken = this.generateToken(resetCredentialsDto.email, 60 * 60 * 24); // Expires in 24 hours

        const isEmailSent = await sendPasswordResetEmail(resetCredentialsDto.email, temporaryToken);
        if (!isEmailSent) {
            throw new InternalServerErrorException(null, 'Password reset email was not sent');
        }
    }

    /** Helper methods */
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
