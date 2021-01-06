import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {TypeOrmCoreModule} from '@nestjs/typeorm/dist/typeorm-core.module';
import {typeOrmConfig} from './config/typeorm.config';
import {UserModule} from './user/user.module';

@Module({
    imports: [
        TypeOrmCoreModule.forRoot(typeOrmConfig),
        AuthModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
