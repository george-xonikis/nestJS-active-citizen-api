import {Injectable} from '@nestjs/common';
import * as config from 'config';

@Injectable()
export class AppService {
    private serverConfig = config.get('server');

    getHello(): Object {
        return {
            message: 'Hello World!',
            environment: process.env.NODE_ENV,
            port: process.env.PORT,
            origin: this.serverConfig.origin
        };
    }
}
