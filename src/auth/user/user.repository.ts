import {Repository, EntityRepository} from 'typeorm';
import {User} from './user.entity';
import {UnauthorizedException} from '@nestjs/common';


@EntityRepository(User)
export class UserRepository extends Repository<User> {

    public async getUser(email: string): Promise<User> {
        const user = await this.findOne({email});

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async saveUser(user: User): Promise<User> {
        await user.save();
        return user;
    }

    async deleteUser(email: string): Promise<any> {
        return await this.delete({email});
    }

}
