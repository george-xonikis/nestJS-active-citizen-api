import {Repository, EntityRepository} from 'typeorm';
import {User} from './user.entity';


@EntityRepository(User)
export class UserRepository extends Repository<User> {

    public async getUser(email: string): Promise<User> {
        return await this.findOne({email});
    }

    async saveUser(user: User): Promise<User> {
        await user.save();
        return user;
    }

    async deleteUser(email: string): Promise<any> {
        return await this.delete({email});
    }

}
