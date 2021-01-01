import {Controller, Post, Body, Patch} from '@nestjs/common';
import {AuthCredentialsDto} from './dto/auth-credentials.dto';
import {AuthService} from './auth.service';
import {UserActivationDto} from './dto/user-activation.dto';
import {User} from './user/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<string> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Patch('/activate')
    activateUser(@Body() userActivationDto: UserActivationDto): Promise<Partial<User>> {
        return this.authService.activateUser(userActivationDto);
    }

}