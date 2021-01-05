import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserRepository} from './user/user.repository';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {JwtStrategy} from './jwt/jwt.strategy';
import * as config from 'config';
import {UserController} from './user/user.controller';
import {UserService} from './user/user.service';
import {AuthRepository} from './auth.repository';
import {TokenService} from './token/token.service';
import {TokenRepository} from './token/token.repository';

const jwtConfig = config.get('jwt');

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt'
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || jwtConfig.secret,
            signOptions: {
                expiresIn: jwtConfig.expiresIn,
            },
        }),
        TypeOrmModule.forFeature([UserRepository]),
    ],
    controllers: [
        AuthController,
        UserController
    ],
    providers: [
        AuthService,
        AuthRepository,
        TokenService,
        TokenRepository,
        UserService,
        JwtStrategy,
    ],
    exports: [
        JwtStrategy,
        PassportModule,
    ],
})
export class AuthModule {
}
