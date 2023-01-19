import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserLoginDTO } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/admin/register')
  async register(@Body() body: AuthCredentialsDto): Promise<void> {
    return this.authService.register(body);
  }

  @Post('/admin/login')
  async login(
    @Body() loginData: UserLoginDTO,
    //@Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginData);
    // try {
    //   const token = this.authService.login(loginData);
    //   response.cookie('token', token, { httpOnly: true });
    //   return {
    //     message: 'login success',
    //   };
    // } catch (error) {
    //   return error;
    // }
  }

  @Post('/profile')
  @UseGuards(AuthGuard())
  async profile(@Req() req) {
    return req.user;
  }
}
