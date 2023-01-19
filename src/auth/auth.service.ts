import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bycrypt from 'bcryptjs';
import { User } from 'src/users/user.entity';
import { UserLoginDTO } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(user: AuthCredentialsDto): Promise<void> {
    const { password_confirm, ...data } = user;
    // check password_confirm
    if (user.password !== password_confirm) {
      throw new BadRequestException('Password does not match');
    }
    // encrypt password
    const salt = await bycrypt.genSalt();
    const hashedPassword = await bycrypt.hash(data.password, salt);
    // save in DB
    await this.userService.saveUser({
      ...data,
      password: hashedPassword,
      isAmbassador: false,
    });
  }

  async validate(loginData: UserLoginDTO): Promise<User> {
    const { password, username } = loginData;
    // check if user exists
    const user = await this.userService.findOneBy(username);

    // compare password
    if (user && (await bycrypt.compare(password, user.password))) {
      return user;
    } else {
      throw new UnauthorizedException('unauthorized');
    }
  }

  async login(loginData: UserLoginDTO) {
    const user = await this.validate(loginData);
    const { username } = user;

    const payload = { username };
    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }
}
