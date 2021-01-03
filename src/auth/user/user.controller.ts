import {AuthGuard} from '@nestjs/passport';
import {Body, Controller, Get, Patch, UseGuards} from '@nestjs/common';
import {GetUser} from './get-user.decorator';
import {UserService} from './user.service';
import {User} from './user.entity';
import {ChangePasswordDto} from '../dto/change-password.dto';
import {ChangeUserProfileDto} from '../dto/change-user-profile.dto';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
    constructor(private userService: UserService) {
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

}