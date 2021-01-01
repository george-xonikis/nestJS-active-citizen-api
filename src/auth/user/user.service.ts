import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserRepository} from './user.repository';
import {extractUserProfile} from '../dto/auth-credentials.dto';
import {User} from './user.entity';


@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {
    }

    async getUserProfile(user: User): Promise<Partial<User>> {
        const _user = await this.userRepository.getUser(user.email);
        return extractUserProfile(_user);
    }

}
