import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {AuthCredentialsDto} from './dto/auth-credentials.dto';
import {AuthRepository} from './auth.repository';
import {UserActivationDto} from './dto/user-activation.dto';
import {Base64} from 'js-base64';
import {User} from './user/user.entity';


@Injectable()
export class AuthService {
    constructor(@InjectRepository(AuthRepository) private authRepository: AuthRepository,
                private jwtService: JwtService) {
    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        return await this.authRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user: Partial<User> }> {
        const {user, accessToken} = await this.authRepository.signIn(authCredentialsDto, this.jwtService);
        return {accessToken, user};
    }

    async activateUser(userActivationDto: UserActivationDto): Promise<Partial<User>> {
        const decodedEmail = Base64.decode(userActivationDto.email);
        const decodedActivationCode = Base64.decode(userActivationDto.activationCode);
        return this.authRepository.activateUser(decodedEmail, decodedActivationCode);
    }


}
