import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {TypeOrmCoreModule} from '@nestjs/typeorm/dist/typeorm-core.module';
import {typeOrmConfig} from './config/typeorm.config';
import {UserModule} from './user/user.module';
import {TokenModule} from './token/token.module';
import {APP_GUARD} from '@nestjs/core';
import {TokenGuard} from './core/guards/token-guard.service';


@Module({
    imports: [
        TypeOrmCoreModule.forRoot(typeOrmConfig),
        AuthModule,
        UserModule,
        TokenModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: TokenGuard,
        },
    ],
})
export class AppModule {
}
