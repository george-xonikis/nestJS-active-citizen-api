import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {TokenService} from '../../token/token.service';


@Injectable()
export class TokenGuard implements CanActivate {

    /** This guard blocks requests with invalid tokens.
     *  When the users logout, the token becomes invalid.
     */

    constructor(private tokenService: TokenService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const host = context.switchToHttp()
        const request = host.getRequest();
        const token = request.headers.authorization && request.headers.authorization.replace('Bearer ', '');

        if (!token) {
            return true;
        }

        const isTokenInvalid = await this.tokenService.isTokenInvalid(token)

        if (isTokenInvalid) {
            throw new UnauthorizedException('Token is not valid');
        }

        return true;
    }


}
