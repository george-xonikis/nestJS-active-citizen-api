import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {TokenRepository} from './token.repository';
import {AuthService} from '../auth/auth.service';


@Injectable()
export class TokenService {
    constructor(@InjectRepository(TokenRepository) private tokenRepository: TokenRepository,
                private authService: AuthService) {
    }

    public async addToken(bearer: string): Promise<{ message: string }> {
        /** When the users logout, the token is added in the invalids list */
        const payload = this.authService.verifyToken(bearer);
        return this.tokenRepository.addToken(bearer, Number(payload.exp));
    }

    public async isTokenInvalid(bearer: string): Promise<Boolean> {
        /** If token exists in db, is means that this token is invalid */
        const tokenInstance = await this.tokenRepository.getToken(bearer);
        return !!tokenInstance;
    }
}
