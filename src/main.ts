import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger, ValidationPipe} from '@nestjs/common';
import * as config from 'config';


async function bootstrap() {
    const serverConfig = config.get('server');
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);

    if (process.env.NODE_ENV === 'development') {
        app.enableCors();
    } else {
        app.enableCors( {origin: serverConfig.origin});
        logger.log(`Accepting requests from origin: ${serverConfig.origin}`)
    }

    /** Use validation pipes in all controllers */
    app.useGlobalPipes(new ValidationPipe());

    const port = process.env.APP_PORT || serverConfig.port;
    await app.listen(port);
    logger.log(`App Started Successfully on port ${port}`);
}

bootstrap();
