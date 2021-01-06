import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {TokenService} from '../../token/token.service';
import {AuthController} from '../../auth/auth.controller';


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
        const bearer = request.headers.authorization && request.headers.authorization.replace('Bearer ', '');

        /** Allow requests which are handled by Auth Controller */
        if (context.getClass() === AuthController) {
            return true;
        }

        const isTokenInvalid = await this.tokenService.isTokenInvalid(bearer)

        if (isTokenInvalid) {
            throw new UnauthorizedException('Token is not valid');
        }

        return true;
    }


}
