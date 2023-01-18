import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ username });
  }

  async removeById(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async saveUser(user: User): Promise<User> {
    let savedUser;
    try {
      savedUser = await this.userRepository.save(user);
    } catch (err) {
      if (err.errno === 1062) {
        throw new ConflictException('username or email alreday exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return savedUser;
  }
}
