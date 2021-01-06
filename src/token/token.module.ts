import {Module} from '@nestjs/common';
import {TokenRepository} from './token.repository';
import {TokenService} from './token.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth/auth.module';


@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([TokenRepository]),
    ],
    providers: [
        TokenService,
    ],
    exports: [
        TokenService,
    ]
})
export class TokenModule {
}
