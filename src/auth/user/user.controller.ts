import {AuthGuard} from '@nestjs/passport';
import {Controller, Get, UseGuards} from '@nestjs/common';
import {GetUser} from './get-user.decorator';
import {UserService} from './user.service';
import {User} from './user.entity';

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