import {AuthGuard} from '@nestjs/passport';
import {Body, Controller, Get, Patch, UseGuards} from '@nestjs/common';
import {GetUser} from './get-user.decorator';
import {UserService} from './user.service';
import {User} from './user.entity';
import {ChangePasswordDto} from '../dto/change-password.dto';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
    constructor(private userService: UserService) {
    }

    @Get('/profile')
    getUserProfile(@GetUser() user: User): Promise<Partial<User>> {
        return this.userService.getUserProfile(user);
    }

    @Patch('/change-password')
    changePassword(@GetUser() user: User, @Body() changePasswordDto: ChangePasswordDto): Promise<Partial<User>> {
        return this.userService.changePassword(user, changePasswordDto);
    }

}