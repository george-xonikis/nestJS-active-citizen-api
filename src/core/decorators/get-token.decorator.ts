import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {Token} from '../../token/token.entity';

export const GetToken = createParamDecorator((data, context: ExecutionContext): Token => {
    const host = context.switchToHttp()
    const request = host.getRequest();
    return request.headers.authorization.replace('Bearer ', '');
});
