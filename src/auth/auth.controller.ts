import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserLoginDTO } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/admin/register')
  register(@Body() body: AuthCredentialsDto) {
    return this.authService.register(body);
  }

  @Post('/admin/login')
  login(
    @Body() loginData: UserLoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const token = this.authService.login(loginData);

      response.cookie('token', token, { httpOnly: true });

      return {
        message: 'login success',
      };
    } catch (error) {
      return error;
    }
  }
}
