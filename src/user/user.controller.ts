import {AuthGuard} from '@nestjs/passport';
import {Body, Controller, Get, Patch, Post, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from './user.entity';
import {TokenService} from '../token/token.service';
import {GetUser} from '../core/decorators/get-user.decorator';
import {ChangePasswordDto} from '../auth/dto/change-password.dto';
import {ChangeUserProfileDto} from '../auth/dto/change-user-profile.dto';
import {GetToken} from '../core/decorators/get-token.decorator';


@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
    constructor(private userService: UserService,
                private tokenService: TokenService) {
    }

    @Get('/profile')
    getUserProfile(@GetUser() user: User): Promise<Partial<User>> {
        return this.userService.getUserProfile(user);
    }

    @Patch('/profile')
    changeUserProfile(@GetUser() user: User, @Body() changeUserProfileDto: ChangeUserProfileDto): Promise<Partial<User>> {
        return this.userService.changeUserProfile(user, changeUserProfileDto);
    }

    @Patch('/change-password')
    changePassword(@GetUser() user: User, @Body() changePasswordDto: ChangePasswordDto): Promise<Partial<User>> {
        return this.userService.changePassword(user, changePasswordDto);
    }

    @Post('/logout')
    logout(@GetToken() bearer: string): Promise<{ message: string }> {
        return this.tokenService.addToken(bearer);
    }

}
