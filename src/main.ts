import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger, ValidationPipe} from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
    const serverConfig = config.get('server');
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    /** Use validation pipes in all controllers */
    app.useGlobalPipes(new ValidationPipe());

    const port = process.env.PORT || serverConfig.port;
    await app.listen(port);
    logger.log(`App Started Successfully on port ${port}`);
}

bootstrap();
