import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserRepository} from './user.repository';
import {extractUserProfile} from '../dto/auth-credentials.dto';
import {User} from './user.entity';
import {ChangePasswordDto} from '../dto/change-password.dto';
import {AuthRepository} from '../auth.repository';


@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository,
                private authRepository: AuthRepository) {
    }

    async getUserProfile(user: User): Promise<Partial<User>> {
        return extractUserProfile(user);
    }

    async changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<Partial<User>> {
        if (changePasswordDto.newPassword !== changePasswordDto.passwordRepeat) {
            throw new BadRequestException('Passwords do not match');
        }

        const isPasswordValid = await this.authRepository.isPasswordValid(changePasswordDto.password, user.password, user.salt);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await this.userRepository.saveUser(user);

        return extractUserProfile(user);
    };
    
}
