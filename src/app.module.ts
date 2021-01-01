import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {TypeOrmCoreModule} from '@nestjs/typeorm/dist/typeorm-core.module';
import {typeOrmConfig} from './config/typeorm.config';

@Module({
    imports: [
        TypeOrmCoreModule.forRoot(typeOrmConfig),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
