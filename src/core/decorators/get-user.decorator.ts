import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {User} from '../../user/user.entity';

export const GetUser = createParamDecorator((data, context: ExecutionContext): User => {
    const host = context.switchToHttp()
    const request = host.getRequest();
    return request.user;
});
