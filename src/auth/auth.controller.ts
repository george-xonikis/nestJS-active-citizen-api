import {Controller, Post, Body, Patch} from '@nestjs/common';
import {AuthCredentialsDto} from './dto/auth-credentials.dto';
import {AuthService} from './auth.service';
import {UserActivationDto} from './dto/user-activation.dto';
import {PasswordResetDto} from './dto/password-reset.dto';
import {PasswordResetConfirmDto} from './dto/password-reset-confirm.dto';
import {User} from '../user/user.entity';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{message: string}> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/login')
    login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user: Partial<User> }> {
        return this.authService.login(authCredentialsDto);
    }

    @Patch('/signup/activate')
    activateUser(@Body() userActivationDto: UserActivationDto): Promise<Partial<User>> {
        return this.authService.activateUser(userActivationDto);
    }

    @Post('/password-reset')
    passwordReset(@Body() resetPasswordDto: PasswordResetDto): Promise<{message: string}> {
        return this.authService.passwordReset(resetPasswordDto);
    }

    @Post('/password-reset/confirm')
    passwordResetConfirm(@Body() passwordResetConfirmDto: PasswordResetConfirmDto): Promise<Partial<User>> {
        return this.authService.passwordResetConfirm(passwordResetConfirmDto);
    }

}
