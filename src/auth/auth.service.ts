import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bycrypt from 'bcryptjs';
import { User, UserReturnType } from 'src/users/user.entity';
import { UserLoginDTO } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(user: AuthCredentialsDto): Promise<UserReturnType> {
    const { password_confirm, ...data } = user;
    // check password_confirm
    if (user.password_confirm !== password_confirm) {
      throw new BadRequestException('Password does not match');
    }
    // encrypt password
    const salt = await bycrypt.genSalt();
    const hashedPassword = await bycrypt.hash(data.password, salt);
    // save in DB
    const newUser = await this.userService.saveUser({
      ...data,
      password: hashedPassword,
      isAmbassador: false,
    });
    //return sanitized User Object
    const { password, ...returnData } = newUser;

    return returnData;
  }

  async validate(loginData: UserLoginDTO): Promise<User> {
    // check if user exists
    const user = await this.userService.findOneByEmail(loginData.email);

    if (!user) {
      throw new UnauthorizedException('unauthorized');
    }
    // compare password

    const isPasswordCompared = await bycrypt.compare(
      loginData.password,
      user.password,
    );
    if (!isPasswordCompared) {
      throw new BadRequestException('unauthorized');
    }

    return user;
  }

  async login(loginData: UserLoginDTO) {
    const user = await this.validate(loginData);

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }
}
