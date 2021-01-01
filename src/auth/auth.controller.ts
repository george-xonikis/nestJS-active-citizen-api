import {Controller, Post, Body, Patch} from '@nestjs/common';
import {AuthCredentialsDto} from './dto/auth-credentials.dto';
import {AuthService} from './auth.service';
import {UserActivationDto} from './dto/user-activation.dto';
import {User} from './user/user.entity';
import {ResetCredentialsDto} from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('/sign-up')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<string> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/login')
    login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user: Partial<User> }> {
        return this.authService.login(authCredentialsDto);
    }

    @Patch('/activate')
    activateUser(@Body() userActivationDto: UserActivationDto): Promise<Partial<User>> {
        return this.authService.activateUser(userActivationDto);
    }

    @Post('/reset-password')
    resetPassword(@Body() resetCredentialsDto: ResetCredentialsDto): Promise<void> {
        return this.authService.resetPassword(resetCredentialsDto);
    }

    // @Post('/reset-password/confirm')
    // resetPasswordConfirm(@Body() email: string): Promise<void> {
    //     return this.authService.resetPassword(email);
    // }

}