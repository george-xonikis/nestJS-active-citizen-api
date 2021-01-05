import {EntityRepository, Repository} from 'typeorm';
import {Token} from './token.entity';
import {InternalServerErrorException} from '@nestjs/common';

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {

    public async add(_token: string, _expiresIn: number): Promise<{ message: string }> {
        const token = new Token();
        token.token = _token;
        token.expiresIn = _expiresIn;

        try {
            await token.save();
            return {message: 'User logout successfully'};
        } catch (error) {
            throw new InternalServerErrorException({message: 'Token could not be added in the db'});
        }

    }


}