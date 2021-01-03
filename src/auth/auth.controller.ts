import {Controller, Post, Body, Patch} from '@nestjs/common';
import {AuthCredentialsDto} from './dto/auth-credentials.dto';
import {AuthService} from './auth.service';
import {UserActivationDto} from './dto/user-activation.dto';
import {User} from './user/user.entity';
import {ResetPasswordDto} from './dto/reset-password.dto';
import {ResetPasswordConfirmDto} from './dto/reset-password-confirm.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<string> {
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

    @Post('/reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Post('/reset-password/confirm')
    resetPasswordConfirm(@Body() resetPasswordConfirmDto: ResetPasswordConfirmDto): Promise<Partial<User>> {
        return this.authService.resetPasswordConfirm(resetPasswordConfirmDto);
    }

}