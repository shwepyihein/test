import { Controller,Body,Post} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './model/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class AdminUserController {
  constructor(private _userService: UserService) { }
  @Post('Register')
  loginAdmin(@Body() data: CreateUserDto) {
    return this._userService.createUser(data)
  }
  @Post('Login')
  loginUser(@Body() data: LoginUserDto) {
    return this._userService.loginUser(data)
  }
}
