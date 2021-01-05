import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {TokenRepository} from './token.repository';
import {JwtService} from '@nestjs/jwt';


@Injectable()
export class TokenService {
    constructor(@InjectRepository(TokenRepository) private tokenRepository: TokenRepository,
                private jwtService: JwtService) {
    }

    public async addToken(token: string): Promise<{ message: string }> {
        const payload = this.jwtService.verify(token);
        return this.tokenRepository.add(token, Number(payload.exp));
    }

    public async isTokenInBlackList(token: string): Promise<Boolean> {
        const isTokenInBlackList = await this.tokenRepository.findOne(token);

        return !!isTokenInBlackList;
    }
}