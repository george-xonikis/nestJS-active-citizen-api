import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {Token} from '../../auth/token/token.entity';

export const GetToken = createParamDecorator((data, ctx: ExecutionContext): Token => {
    const req = ctx.switchToHttp().getRequest();
    return req.headers.authorization.replace('Bearer ', '');
});