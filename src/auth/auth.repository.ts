import {Repository, EntityRepository} from 'typeorm';
import {BadRequestException, ConflictException, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {AuthCredentialsDto} from './dto/auth-credentials.dto';
import {UserRepository} from './user/user.repository';
import {User} from './user/user.entity';
import {extractUserProfile, getActivationCode} from './user/helper';


@EntityRepository(User)
export class AuthRepository extends Repository<User> {

    constructor(private userRepository: UserRepository) {
        super();
    }

    async createUser(authCredentialsDto: AuthCredentialsDto, hashedPassword: string, salt: string): Promise<User> {
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

            return user;

        } catch (error) {
            if (error.code === '23505') { // duplicated email
                throw new ConflictException({code: 'email_exists', message: 'Email already exists'});
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async activateUser(email: string, activationCode: string): Promise<Partial<User>> {
        const user = await this.userRepository.getUser(email);

        if (user.active) {
            throw new BadRequestException({code: 'active_error', message: 'Account already activated'});
        }

        if (user.activationCode !== activationCode) {
            throw new BadRequestException({code: 'email_or_activation_code_error', message: 'Invalid Email or Activation Code'});
        }

        user.active = true;
        await user.save();
        return extractUserProfile(user);
    }

}