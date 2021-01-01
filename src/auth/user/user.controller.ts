import {AuthGuard} from '@nestjs/passport';
import {Controller, Get, Patch, UseGuards} from '@nestjs/common';
import {GetUser} from './get-user.decorator';
import {User} from '../user.entity';
import {UserService} from './user.service';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
    constructor(private authService: UserService) {
    }

    @Get('/profile')
    getUserProfile(@GetUser() user: User): Promise<Partial<User>> {
        return this.authService.getUserProfile(user);
    }

}