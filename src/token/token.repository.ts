import {EntityRepository, Repository} from 'typeorm';
import {Token} from './token.entity';
import {BadRequestException, InternalServerErrorException} from '@nestjs/common';

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {

    public async addToken(_token: string, _expiresIn: number): Promise<{ message: string }> {
        const token = new Token();
        token.bearer = _token;
        token.expiresIn = _expiresIn;

        try {
            await token.save();
            return {message: 'User logout successfully'};
        } catch (error) {
            throw new InternalServerErrorException({message: 'Token could not be added in the db'});
        }
    }

    public async getToken(token: string): Promise<Token> {
        try {
            return await this.findOne({bearer: token});
        } catch (err) {
            throw new BadRequestException({message: 'Token not found'})
        }

    }

}
